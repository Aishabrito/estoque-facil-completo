import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class ProdutoController {
    async listar(_req, res) {
        try {
            const produtos = await prisma.produto.findMany({ orderBy: { id: 'desc' } });
            return res.json(produtos);
        }
        catch (err) {
            console.error("Erro ao listar:", err.message);
            return res.status(500).json({ error: "Erro ao buscar lista de produtos" });
        }
    }
    async criar(req, res) {
        const { nome, categoria, precoCusto, preco, estoque, estoqueMinimo } = req.body;
        // Limpeza e Padronização
        const qtdInicial = Math.abs(Number(estoque)) || 0;
        const custo = Math.abs(Number(String(precoCusto).replace(',', '.'))) || 0;
        const venda = Math.abs(Number(String(preco).replace(',', '.'))) || 0;
        const min = Number(estoqueMinimo) || 5;
        if (!nome || !venda) {
            return res.status(400).json({ error: "Nome e Preço de Venda são obrigatórios." });
        }
        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const produto = await tx.produto.create({
                    data: {
                        nome: String(nome).trim(),
                        categoria: categoria ? String(categoria).trim() : 'Geral',
                        precoCusto: custo,
                        preco: venda,
                        estoque: qtdInicial,
                        estoqueMinimo: min
                    }
                });
                if (qtdInicial > 0) {
                    await tx.movimentacao.create({
                        data: {
                            produtoId: produto.id,
                            tipo: "ENTRADA",
                            qtd: qtdInicial,
                            motivo: "Saldo Inicial de Cadastro"
                        }
                    });
                }
                return produto;
            });
            console.log(`[SUCESSO] Produto criado: ${nome}`);
            return res.status(201).json(resultado);
        }
        catch (err) {
            console.error("ERRO NO CADASTRO:", err.message);
            return res.status(500).json({ error: "Erro interno ao criar produto." });
        }
    }
    async atualizar(req, res) {
        const { id } = req.params;
        const { nome, categoria, preco, precoCusto, estoqueMinimo } = req.body;
        try {
            const atualizado = await prisma.produto.update({
                where: { id: Number(id) },
                data: {
                    nome: nome ? String(nome).trim() : undefined,
                    categoria,
                    preco: preco ? Number(String(preco).replace(',', '.')) : undefined,
                    precoCusto: precoCusto ? Number(String(precoCusto).replace(',', '.')) : undefined,
                    estoqueMinimo: estoqueMinimo ? Number(estoqueMinimo) : undefined
                }
            });
            return res.json(atualizado);
        }
        catch {
            return res.status(500).json({ error: "Erro ao atualizar produto." });
        }
    }
    async deletar(req, res) {
        const { id } = req.params;
        try {
            await prisma.$transaction([
                prisma.movimentacao.deleteMany({ where: { produtoId: Number(id) } }),
                prisma.produto.delete({ where: { id: Number(id) } })
            ]);
            return res.json({ message: "Produto e histórico removidos." });
        }
        catch {
            return res.status(500).json({ error: "Erro ao deletar produto." });
        }
    }
}
