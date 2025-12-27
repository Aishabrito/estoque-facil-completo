import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class DashboardController {
  async resumo(req, res) {
    try {
      const totalProdutos = await prisma.produto.count();
      const somaEstoque = await prisma.produto.aggregate({ _sum: { estoque: true } });
      const ultimasMovs = await prisma.movimentacao.findMany({
        take: 5,
        orderBy: { data: 'desc' },
        include: { produto: { select: { nome: true } } }
      });

      return res.json({
        totalProdutos,
        totalEstoque: somaEstoque._sum.estoque || 0,
        movimentacoes: ultimasMovs
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}