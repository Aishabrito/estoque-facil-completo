import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  // Método de Listagem (Antigo 'listar')
  async index(req, res) {
    try {
      const historico = await prisma.movimentacao.findMany({
        orderBy: { data: 'desc' },
        include: { 
          // Traz o produto INTEIRO. Se usar 'select: { nome: true }', 
          // o Dashboard pode dar erro se tentar ler outra coisa.
          produto: true 
        }
      });
      return res.json(historico);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Método de Criação (Antigo 'criar')
  async store(req, res) {
    const { produtoId, tipo, qtd, reason } = req.body; // Adicionei 'reason' caso queira salvar o motivo

    // Força virar maiúsculo para garantir que o IF funcione
    // Se o frontend mandar 'entrada', aqui vira 'ENTRADA'
    const tipoFormatado = tipo ? tipo.toUpperCase() : ''; 

    if (!produtoId || !qtd || !tipoFormatado) {
        return res.status(400).json({ error: "Dados incompletos." });
    }

    try {
      // 1. Busca o produto para validar estoque
      const produtoAlvo = await prisma.produto.findUnique({
        where: { id: Number(produtoId) }
      });

      if (!produtoAlvo) {
        return res.status(404).json({ error: "Produto não encontrado." });
      }

      // Validação de Saldo para SAÍDA
      if (tipoFormatado === 'SAIDA' && produtoAlvo.estoque < Number(qtd)) {
        return res.status(400).json({ 
          error: `Saldo insuficiente. Estoque atual: ${produtoAlvo.estoque}, Tentativa: ${qtd}` 
        });
      }

      // 2. Transação: Cria o histórico E atualiza o saldo juntos
      const resultado = await prisma.$transaction(async (tx) => {
        const mov = await tx.movimentacao.create({
          data: { 
              produtoId: Number(produtoId), 
              tipo: tipoFormatado, 
              qtd: Number(qtd),
              motivo: reason || '' // Salva o motivo se tiver
          }
        });

        // Define se soma ou subtrai
        const operacao = tipoFormatado === 'ENTRADA' ? { increment: Number(qtd) } : { decrement: Number(qtd) };
        
        // Atualiza o estoque
        const produtoAtualizado = await tx.produto.update({
          where: { id: Number(produtoId) },
          data: { estoque: operacao }
        });

        return { mov, saldoAtual: produtoAtualizado.estoque };
      });

      return res.status(201).json(resultado);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao processar movimentação." });
    }
  }
}