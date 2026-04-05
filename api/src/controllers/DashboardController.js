import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async resumo(req, res) {
    try {
      const produtos = await prisma.produto.findMany();

      const valorPatrimonial = produtos.reduce((total, p) => {
        const custo = Number(String(p.precoCusto || 0).replace(',', '.')) || 0;
        const estoque = Number(p.estoque) || 0;
        return total + (custo * estoque);
      }, 0);

      const receitaPotencial = produtos.reduce((total, p) => {
        const venda = Number(String(p.preco || 0).replace(',', '.')) || 0;
        const estoque = Number(p.estoque) || 0;
        return total + (venda * estoque);
      }, 0);

      const totalItens = produtos.reduce((total, p) => {
        return total + (Number(p.estoque) || 0);
      }, 0);

      // Categorias únicas — corrigido
      const categorias = new Set(produtos.map(p => p.categoria).filter(Boolean));
      const totalCategorias = categorias.size;

      const baixoEstoque = produtos.filter(p => {
        const estoqueAtual = Number(p.estoque) || 0;
        const limiteAlerta = Number(p.estoqueMinimo) || 5;
        return estoqueAtual <= limiteAlerta;
      }).length;

      // Inclui usuario para rastreabilidade no feed
      const movimentacoes = await prisma.movimentacao.findMany({
        take: 10,
        orderBy: { data: 'desc' },
        include: {
          produto: true,
          usuario: {
            select: { id: true, nome: true, isAdmin: true }
          }
        }
      });

      const lucroEstimado = receitaPotencial - valorPatrimonial;

      return res.json({
        totalItens,
        totalCategorias,
        valorPatrimonial,
        receitaPotencial,
        lucroEstimado,
        baixoEstoque,
        movimentacoes
      });

    } catch (error) {
      console.error("ERRO NO DASHBOARD:", error.message);
      return res.status(500).json({ error: "Erro interno ao calcular indicadores." });
    }
  }
};