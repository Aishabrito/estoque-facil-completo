import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async resumo(req, res) {
    try {
      // 1. OBRIGATÓRIO: Busca os dados da tabela PRODUTOS
      const produtos = await prisma.produto.findMany();

      console.log("--- DEBUG DO DASHBOARD ---");
      console.log(`Encontrei ${produtos.length} produtos no banco.`);

      // 2. CÁLCULO DO VALOR TOTAL (Preço * Quantidade)
      const valorTotal = produtos.reduce((total, produto) => {
        // Converte para número, trocando vírgula por ponto se necessário
        const preco = Number(String(produto.preco).replace(',', '.')) || 0;
        const estoque = Number(produto.estoque) || 0;
        
        return total + (preco * estoque);
      }, 0);

      // 3. CÁLCULO DO TOTAL DE ITENS (Soma das quantidades físicas)
      const totalItens = produtos.reduce((total, produto) => {
        return total + (Number(produto.estoque) || 0);
      }, 0);

      // 4. CÁLCULO DE ESTOQUE BAIXO
      const baixoEstoque = produtos.filter(p => (Number(p.estoque) || 0) < 10).length;

      // 5. Busca as últimas movimentações para a lista de baixo
      const movimentacoes = await prisma.movimentacao.findMany({
        take: 5,
        orderBy: { data: 'desc' },
        include: { produto: true }
      });

      console.log(`Totais calculados -> Valor: R$${valorTotal} | Itens: ${totalItens}`);
      console.log("--------------------------");

      return res.json({
        totalItens,        // Quantidade física
        totalCategorias: produtos.length, // Quantidade de cadastros
        valorTotal,        // Valor em dinheiro
        baixoEstoque,      // Alertas
        movimentacoes
      });

    } catch (error) {
      console.error("Erro ao calcular dashboard:", error);
      return res.status(500).json({ error: "Erro interno no dashboard" });
    }
  }
};