import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async resumo(req, res) {
    try {
      const produtos = await prisma.produto.findMany();

      // --- CÁLCULO DE VENDAS DO MÊS ---
      const agora = new Date();
      // Cria uma data no dia 01 do mês atual às 00:00:00
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

      const vendasMes = await prisma.venda.aggregate({
        _sum: {
          total: true // ⚠️ Verifique se no seu Schema o campo se chama 'total' ou 'valorTotal'
        },
        where: {
          data: { // ⚠️ Verifique se no seu Schema o campo de data se chama 'data' ou 'criadoEm'
            gte: inicioMes
          }
        }
      });

      const totalVendasMes = Number(vendasMes._sum.total) || 0;
      // -------------------------------

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

      const categorias = new Set(produtos.map(p => p.categoria).filter(Boolean));
      const totalCategorias = categorias.size;

      const baixoEstoque = produtos.filter(p => {
        const estoqueAtual = Number(p.estoque) || 0;
        const limiteAlerta = Number(p.estoqueMinimo) || 5;
        return estoqueAtual <= limiteAlerta;
      }).length;

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
        totalVendasMes, // <-- ENVIANDO PARA O FRONT-END
        movimentacoes
      });

    } catch (error) {
      console.error("ERRO NO DASHBOARD:", error.message);
      return res.status(500).json({ error: "Erro interno ao calcular indicadores." });
    }
  }
};