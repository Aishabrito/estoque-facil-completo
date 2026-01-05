import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ProdutoController {
  
  async listar(req, res) {
    const produtos = await prisma.produto.findMany({ orderBy: { id: 'desc' } });
    return res.json(produtos);
  }

 async criar(req, res) {
    const { nome, categoria, preco, estoque } = req.body;
    
    // Garante que é um número (se vier vazio, assume 0)
    const qtdInicial = Number(estoque) || 0;

    try {
      // Inicia a transação 
      const resultado = await prisma.$transaction(async (tx) => {
        //  Cria o Produto
        const produto = await tx.produto.create({
          data: { 
            nome, 
            categoria, 
            preco, 
            estoque: qtdInicial 
          }
        });

        //  Cria a movimentação inicial SE houver estoque maior que 0
        //
        if (qtdInicial > 0) {
            await tx.movimentacao.create({
              data: {
                produtoId: produto.id,  
                tipo: "ENTRADA",       
                qtd: qtdInicial       
              }
            });
        } 

        return produto;
      });

      return res.status(201).json(resultado);

    } catch (err) {
      console.error("Erro no cadastro:", err);
      return res.status(500).json({ error: "Erro ao criar produto e estoque inicial" });
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