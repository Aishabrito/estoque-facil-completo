import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default {
    async resumo(_req, res) {
        try {
            // 1. Busca todos os produtos para cálculos patrimoniais
            const produtos = await prisma.produto.findMany();
            // 2. Cálculo de Vendas do Mês Atual
            const agora = new Date();
            const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
            const vendasMes = await prisma.venda.aggregate({
                _sum: {
                    total: true
                },
                where: {
                    data: {
                        gte: inicioMes
                    }
                }
            });
            // Garantindo que o valor seja um número válido para o Front-end
            const totalVendasMes = Number(vendasMes._sum?.total || 0);
            // 3. Cálculos de Patrimônio e Receita
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
            // 4. Categorias Únicas
            const categorias = new Set(produtos.map(p => p.categoria).filter(Boolean));
            const totalCategorias = categorias.size;
            // 5. Alertas de Baixo Estoque
            const baixoEstoque = produtos.filter(p => {
                const estoqueAtual = Number(p.estoque) || 0;
                const limiteAlerta = Number(p.estoqueMinimo) || 5;
                return estoqueAtual <= limiteAlerta;
            }).length;
            // 6. Últimas Movimentações (Feed)
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
            // Retorno para o Front-end
            return res.json({
                totalItens,
                totalCategorias,
                valorPatrimonial,
                receitaPotencial,
                lucroEstimado,
                baixoEstoque,
                totalVendasMes,
                movimentacoes
            });
        }
        catch (error) {
            console.error("ERRO NO DASHBOARD:", error.message);
            return res.status(500).json({ error: "Erro interno ao calcular indicadores." });
        }
    }
};
