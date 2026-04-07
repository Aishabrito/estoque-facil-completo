import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async listar(req, res) {
    try {
      const vendas = await prisma.venda.findMany({
        orderBy: { data: 'desc' },
        include: {
          usuario: { select: { id: true, nome: true } },
          itens: {
            include: {
              produto: { select: { id: true, nome: true } }
            }
          }
        }
      });
      return res.json(vendas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar vendas.' });
    }
  },

  async criar(req, res) {
    const { itens, formaPagamento } = req.body;
    const usuarioId = req.usuarioId;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio.' });
    }

    try {
      const resultado = await prisma.$transaction(async (tx) => {

        // 1. Verifica estoque de todos os itens antes de qualquer alteração
        for (const item of itens) {
          const produto = await tx.produto.findUnique({
            where: { id: Number(item.produtoId) }
          });

          if (!produto) {
            throw new Error(`Produto ID ${item.produtoId} não encontrado.`);
          }
          if (Number(produto.estoque) < Number(item.quantidade)) {
            throw new Error(
              `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque} un.`
            );
          }
        }

        // 2. Calcula o total da venda
        const total = itens.reduce((acc, item) => {
          return acc + Number(item.precoNoMomento) * Number(item.quantidade);
        }, 0);

        // 3. Cria o registro da Venda
        const venda = await tx.venda.create({
          data: {
            total,
            formaPagamento: formaPagamento || 'dinheiro',
            usuarioId,
            itens: {
              create: itens.map(item => ({
                produtoId: Number(item.produtoId),
                quantidade: Number(item.quantidade),
                precoNoMomento: Number(item.precoNoMomento),
              }))
            }
          }
        });

        // 4. Decrementa estoque e cria Movimentacao para cada item
        for (const item of itens) {
          await tx.produto.update({
            where: { id: Number(item.produtoId) },
            data: { estoque: { decrement: Number(item.quantidade) } }
          });

          await tx.movimentacao.create({
            data: {
              produtoId: Number(item.produtoId),
              tipo: 'SAIDA',
              qtd: Number(item.quantidade),
              motivo: `Venda #${venda.id} — ${formaPagamento || 'dinheiro'}`,
              usuarioId,
            }
          });
        }

        return venda;
      });

      return res.status(201).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};