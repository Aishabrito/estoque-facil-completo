import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class MovimentacaoController {
  // Lista todo o histórico para as telas de Entradas/Saídas
  async listar(req, res) {
    try {
      const historico = await prisma.movimentacao.findMany({
        orderBy: { data: 'desc' },
        include: { produto: { select: { nome: true } } }
      });
      return res.json(historico);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // O "Coração": Registra a movimentação e atualiza o saldo automaticamente
  async criar(req, res) {
    const { produtoId, tipo, qtd } = req.body;
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const mov = await tx.movimentacao.create({
          data: { produtoId: Number(produtoId), tipo, qtd: Number(qtd) }
        });

        const operacao = tipo === 'ENTRADA' ? { increment: Number(qtd) } : { decrement: Number(qtd) };
        
        const produto = await tx.produto.update({
          where: { id: Number(produtoId) },
          data: { estoque: operacao }
        });

        return { mov, saldoAtual: produto.estoque };
      });
      return res.status(201).json(resultado);
    } catch (err) {
      return res.status(500).json({ error: "Erro na movimentação: " + err.message });
    }
  }
}