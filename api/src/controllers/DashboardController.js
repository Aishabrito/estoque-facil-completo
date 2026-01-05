import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class DashboardController {
  async resumo(req, res) {
    try {
      // 1. Busca dados básicos dos produtos para cálculos
      const produtos = await prisma.produto.findMany({
        select: { estoque: true, preco: true }
      });

      // Cálculos Matemáticos
      const totalItensFisicos = produtos.reduce((acc, p) => acc + p.estoque, 0);
      const valorTotalEstoque = produtos.reduce((acc, p) => acc + (Number(p.preco) * p.estoque), 0);
      const produtosBaixoEstoque = produtos.filter(p => p.estoque < 10).length;
      
      const totalCategorias = await prisma.produto.count(); // Total de produtos cadastrados

      // 2. Busca as últimas 5 movimentações
      const ultimasMovs = await prisma.movimentacao.findMany({
        take: 5,
        orderBy: { data: 'desc' },
        include: { produto: { select: { nome: true } } }
      });

      // Retorna tudo pronto para o Frontend
      return res.json({
        totalItens: totalItensFisicos,
        totalCategorias: totalCategorias,
        valorTotal: valorTotalEstoque,
        baixoEstoque: produtosBaixoEstoque,
        movimentacoes: ultimasMovs
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}