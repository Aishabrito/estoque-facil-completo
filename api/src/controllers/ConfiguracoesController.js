import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async buscar(req, res) {
    try {
      let config = await prisma.configuracoes.findUnique({ where: { id: 1 } });

      // Cria com valores padrão se não existir
      if (!config) {
        config = await prisma.configuracoes.create({
          data: { id: 1, margemLucro: 30, impostos: 15, custoOperacional: 10 }
        });
      }

      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar configurações.' });
    }
  },

  async atualizar(req, res) {
    try {
      const { margemLucro, impostos, custoOperacional } = req.body;

      const config = await prisma.configuracoes.upsert({
        where: { id: 1 },
        update: {
          margemLucro: Number(margemLucro),
          impostos: Number(impostos),
          custoOperacional: Number(custoOperacional),
        },
        create: {
          id: 1,
          margemLucro: Number(margemLucro) || 30,
          impostos: Number(impostos) || 15,
          custoOperacional: Number(custoOperacional) || 10,
        }
      });

      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao salvar configurações.' });
    }
  },

  async resetar(req, res) {
    try {
      // Apaga na ordem correta respeitando as foreign keys, dentro de uma transação atômica
      await prisma.$transaction([
        prisma.itemVenda.deleteMany({}),
        prisma.venda.deleteMany({}),
        prisma.movimentacao.deleteMany({}),
        prisma.produto.deleteMany({}),
        prisma.configuracoes.upsert({
          where: { id: 1 },
          update: { margemLucro: 30, impostos: 15, custoOperacional: 10 },
          create: { id: 1, margemLucro: 30, impostos: 15, custoOperacional: 10 },
        }),
      ]);

      return res.status(200).json({ message: 'Banco de dados resetado com sucesso.' });
    } catch (error) {
      console.error('Erro ao resetar banco:', error);
      return res.status(500).json({ error: 'Erro ao resetar o banco de dados.' });
    }
  }
};