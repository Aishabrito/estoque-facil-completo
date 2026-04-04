import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async resumo(req, res) {
    try {
      // 1. Busca todos os produtos do banco
      const produtos = await prisma.produto.findMany();

      console.log("--- INICIANDO CÁLCULO DO DASHBOARD ---");
      console.log(`Produtos encontrados: ${produtos.length}`);

      // 2. CÁLCULO DO PATRIMÔNIO (Preço de Custo * Quantidade)
      // Usamos Number() e replace para garantir que preços com vírgula não quebrem o código
      const valorPatrimonial = produtos.reduce((total, p) => {
        const custo = Number(String(p.precoCusto || 0).replace(',', '.')) || 0;
        const estoque = Number(p.estoque) || 0;
        return total + (custo * estoque);
      }, 0);

      // 3. CÁLCULO DA RECEITA POTENCIAL (Preço de Venda * Quantidade)
      const receitaPotencial = produtos.reduce((total, p) => {
        const venda = Number(String(p.preco || 0).replace(',', '.')) || 0;
        const estoque = Number(p.estoque) || 0;
        return total + (venda * estoque);
      }, 0);

      // 4. TOTAL DE ITENS FÍSICOS (Soma das unidades)
      const totalItens = produtos.reduce((total, p) => {
        return total + (Number(p.estoque) || 0);
      }, 0);

      // 5. ALERTAS DE ESTOQUE BAIXO
      // Compara o estoque atual com o limite individual (estoqueMinimo)
      const baixoEstoque = produtos.filter(p => {
        const estoqueAtual = Number(p.estoque) || 0;
        const limiteAlerta = Number(p.estoqueMinimo) || 5; // Padrão 5 se estiver nulo
        return estoqueAtual <= limiteAlerta;
      }).length;

      // 6. ÚLTIMAS 5 MOVIMENTAÇÕES (Histórico para a tela inicial)
      const movimentacoes = await prisma.movimentacao.findMany({
        take: 5,
        orderBy: { data: 'desc' },
        include: { produto: true }
      });

      const lucroEstimado = receitaPotencial - valorPatrimonial;

      console.log(`Patrimônio: R$${valorPatrimonial} | Lucro: R$${lucroEstimado}`);
      console.log("--------------------------------------");

      // Retorno para o Front-end
      return res.json({
        totalItens,
        totalCategorias: produtos.length,
        valorPatrimonial, // Investimento
        receitaPotencial, // Venda total
        lucroEstimado,    // Margem bruta
        baixoEstoque,     // Qtd de alertas
        movimentacoes
      });

    } catch (error) {
      console.error("ERRO NO DASHBOARD:", error.message);
      return res.status(500).json({ error: "Erro interno ao calcular indicadores." });
    }
  }
};