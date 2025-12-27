import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO SWAGGER (JSON) ---
const swaggerDefinition = {
  openapi: '3.0.0',
  info: { title: 'Estoque Fácil API 📦', version: '3.0.0', description: 'API completa com DELETE e EDITAR' },
  servers: [{ url: 'http://localhost:3002' }],
  components: {
    schemas: {
      Produto: { type: 'object', properties: { id: { type: 'integer' }, nome: { type: 'string' }, estoque: { type: 'integer' } } },
    },
  },
  paths: {
    '/dashboard': { get: { summary: 'Resumo geral', tags: ['Dashboard'], responses: { 200: { description: 'Totais' } } } },
    '/produtos': {
      get: { summary: 'Lista produtos', tags: ['Produtos'], responses: { 200: { description: 'OK' } } },
      post: { summary: 'Cria produto', tags: ['Produtos'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { nome: { type: 'string' }, categoria: { type: 'string' }, preco: { type: 'number' }, estoque: { type: 'integer' } } } } } }, responses: { 201: { description: 'Criado' } } }
    },
    // ROTA NOVA: Editar e Deletar por ID
    '/produtos/{id}': {
      put: { summary: 'Atualiza produto', tags: ['Produtos'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { nome: { type: 'string' }, preco: { type: 'number' } } } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { summary: 'Apaga produto', tags: ['Produtos'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Apagado' } } }
    },
    '/movimentacoes': {
      get: { summary: 'Histórico completo', tags: ['Movimentações'], responses: { 200: { description: 'Lista' } } },
      post: { summary: 'Registra Entrada/Saída', tags: ['Movimentações'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { produtoId: { type: 'integer' }, tipo: { type: 'string' }, qtd: { type: 'integer' } } } } } }, responses: { 201: { description: 'Sucesso' } } }
    }
  },
};

const swaggerDocs = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROTAS ---

// DASHBOARD
app.get('/dashboard', async (req, res) => {
  try {
    const totalProdutos = await prisma.produto.count();
    const somaEstoque = await prisma.produto.aggregate({ _sum: { estoque: true } });
    const ultimasMovs = await prisma.movimentacao.findMany({
      take: 5, orderBy: { data: 'desc' }, include: { produto: { select: { nome: true } } }
    });
    res.json({ totalProdutos, totalEstoque: somaEstoque._sum.estoque || 0, movimentacoes: ultimasMovs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PRODUTOS
app.get('/produtos', async (req, res) => {
  const produtos = await prisma.produto.findMany({ orderBy: { id: 'desc' } });
  res.json(produtos);
});

app.post('/produtos', async (req, res) => {
  const { nome, categoria, preco, estoque } = req.body;
  try {
    const produto = await prisma.produto.create({ data: { nome, categoria, preco, estoque: Number(estoque) } });
    res.status(201).json(produto);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- AQUI ESTÃO AS ROTAS QUE FALTAVAM ---

// EDITAR (PUT)
app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, preco } = req.body;
  try {
    const atualizado = await prisma.produto.update({
      where: { id: Number(id) }, 
      data: { nome, categoria, preco }
    });
    res.json(atualizado);
  } catch (err) { res.status(500).json({ error: "Erro ao atualizar" }); }
});

// DELETAR (DELETE)
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Apaga o histórico deste produto primeiro (segurança do banco)
    await prisma.movimentacao.deleteMany({ where: { produtoId: Number(id) } });
    // 2. Apaga o produto
    await prisma.produto.delete({ where: { id: Number(id) } });
    res.json({ message: "Produto deletado" });
  } catch (err) { res.status(500).json({ error: "Erro ao deletar: " + err.message }); }
});

// MOVIMENTAÇÕES (Histórico e Ação)
app.get('/movimentacoes', async (req, res) => {
  try {
    const historico = await prisma.movimentacao.findMany({
      orderBy: { data: 'desc' },
      include: { produto: { select: { nome: true } } }
    });
    res.json(historico);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/movimentacoes', async (req, res) => {
  const { produtoId, tipo, qtd } = req.body;
  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const mov = await tx.movimentacao.create({
        data: { produtoId: Number(produtoId), tipo, qtd: Number(qtd) }
      });
      const operacao = tipo === 'ENTRADA' ? { increment: Number(qtd) } : { decrement: Number(qtd) };
      const produto = await tx.produto.update({
        where: { id: Number(produtoId) },
        data: { estoque: operacao }
      });
      return { mov, saldoAtual: produto.estoque };
    });
    res.status(201).json(resultado);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 API Pronta: http://localhost:${PORT}`);
  console.log(`📄 Swagger: http://localhost:${PORT}/api-docs\n`);
});