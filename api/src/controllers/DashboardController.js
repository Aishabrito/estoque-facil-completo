import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  // --- LISTAR (Traz o motivo do banco) ---
  async index(req, res) {
    const movimentacoes = await prisma.movimentacao.findMany({
      orderBy: { data: 'desc' },
      include: { produto: true }
    });
    return res.json(movimentacoes);
  },

  // --- CRIAR (Corrige a soma e salva o motivo) ---
  async store(req, res) {
    const { produtoId, tipo, qtd, reason, motivo } = req.body;

    // 1. Limpeza e Padronização
    const id = Number(produtoId);
    const quantidade = Math.abs(Number(qtd)); // Garante número positivo
    
    // Transforma em maiúsculo e tira espaços extras
    // Ex: " entrada " vira "ENTRADA"
    const tipoFormatado = tipo ? String(tipo).trim().toUpperCase() : ''; 
    
    // Pega o motivo de qualquer um dos campos que o front mandar
    const motivoFinal = motivo || reason || '';

    // --- DEBUG NO TERMINAL (Para você conferir) ---
    console.log("--------------------------------");
    console.log(`Processando: ${tipoFormatado}`);
    console.log(`Qtd: ${quantidade} | Motivo: ${motivoFinal}`);
    // ---------------------------------------------

    if (!id || !quantidade || !tipoFormatado) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // Verifica se produto existe
        const produto = await tx.produto.findUnique({ where: { id } });
        if (!produto) throw new Error("Produto não encontrado.");

        let operacao;

        // 2. Lógica Exata de Soma/Subtração
        if (tipoFormatado === 'ENTRADA') {
            console.log(">> AÇÃO: SOMANDO AO ESTOQUE (+)");
            operacao = { increment: quantidade };
        } 
        else if (tipoFormatado === 'SAIDA') {
            console.log(">> AÇÃO: SUBTRAINDO DO ESTOQUE (-)");
            if (produto.estoque < quantidade) {
                throw new Error(`Saldo insuficiente. Tem: ${produto.estoque}`);
            }
            operacao = { decrement: quantidade };
        } 
        else {
            // Se não for nem um nem outro, dá erro para não fazer besteira
            throw new Error(`Tipo inválido: '${tipoFormatado}'.`);
        }

        // 3. Salva no Histórico (AGORA COM MOTIVO!)
        const mov = await tx.movimentacao.create({
          data: {
            produtoId: id,
            tipo: tipoFormatado,
            qtd: quantidade,
            motivo: motivoFinal // Agora o banco tem essa coluna!
          }
        });

        // 4. Atualiza o Estoque do Produto
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