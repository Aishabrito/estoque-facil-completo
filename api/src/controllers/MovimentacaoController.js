import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  // LISTAR
  async index(req, res) {
    try {
      const movimentacoes = await prisma.movimentacao.findMany({
        orderBy: { data: 'desc' },
        include: { produto: true }
      });
      return res.json(movimentacoes);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
  },

  // CRIAR
  async store(req, res) {
    // 1. Recebe os dados do Front (aceita tanto 'motivo' quanto 'reason')
    const { produtoId, tipo, qtd, reason, motivo } = req.body;

    const id = Number(produtoId);
    const quantidade = Math.abs(Number(qtd)); // Garante positivo
    
    // Limpa o texto: " entrada " vira "ENTRADA"
    const tipoFormatado = tipo ? String(tipo).trim().toUpperCase() : '';
    
    // Resolve o problema do motivo não aparecer
    const motivoFinal = motivo || reason || 'Sem motivo';

    // --- LOG DE DEBUG (Olhe o terminal!) ---
    console.log(`>>> TENTATIVA DE ${tipoFormatado} | QTD: ${quantidade} | MOTIVO: ${motivoFinal}`);

    if (!id || !quantidade || !tipoFormatado) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const produto = await tx.produto.findUnique({ where: { id } });
        if (!produto) throw new Error("Produto não encontrado.");

        let operacao;

        // 2. Lógica Exata
        if (tipoFormatado === 'ENTRADA') {
            console.log("LOGICA: SOMANDO AO ESTOQUE (+)");
            operacao = { increment: quantidade };
        } 
        else if (tipoFormatado === 'SAIDA') {
            console.log("LOGICA: SUBTRAINDO DO ESTOQUE (-)");
            if (produto.estoque < quantidade) {
               throw new Error(`Estoque insuficiente. Tem: ${produto.estoque}`);
            }
            operacao = { decrement: quantidade };
        } 
        else {
            throw new Error(`Tipo inválido: ${tipoFormatado}`);
        }

        // 3. Salva Movimentação (Agora com motivo!)
        const mov = await tx.movimentacao.create({
          data: {
            produtoId: id,
            tipo: tipoFormatado,
            qtd: quantidade,
            motivo: motivoFinal 
          }
        });

        // 4. Atualiza Produto
        const prodAtualizado = await tx.produto.update({
          where: { id },
          data: { estoque: operacao }
        });

        return { mov, novoSaldo: prodAtualizado.estoque };
      });

      return res.status(201).json(resultado);

    } catch (error) {
      console.error("ERRO:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }
};