import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ProdutoController {
  
  async listar(req, res) {
    const produtos = await prisma.produto.findMany({ orderBy: { id: 'desc' } });
    return res.json(produtos);
  }

  async criar(req, res) {
    const { nome, categoria, preco, estoque } = req.body;
    try {
      const produto = await prisma.produto.create({
        data: { nome, categoria, preco, estoque: Number(estoque) }
      });
      return res.status(201).json(produto);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async atualizar(req, res) {
    const { id } = req.params;
    const { nome, categoria, preco } = req.body;
    try {
      const atualizado = await prisma.produto.update({
        where: { id: Number(id) },
        data: { nome, categoria, preco }
      });
      return res.json(atualizado);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao atualizar" });
    }
  }

  async deletar(req, res) {
    const { id } = req.params;
    try {
      await prisma.movimentacao.deleteMany({ where: { produtoId: Number(id) } });
      await prisma.produto.delete({ where: { id: Number(id) } });
      return res.json({ message: "Produto deletado" });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao deletar" });
    }
  }
}