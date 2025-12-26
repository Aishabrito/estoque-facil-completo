import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DO SWAGGER (MODO SEGURO VIA JSON) ---
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Estoque Fácil API 📦',
    version: '1.0.0',
    description: 'Documentação das rotas do sistema de estoque',
  },
  servers: [{ url: 'http://localhost:3002' }],
  components: {
    schemas: {
      Produto: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          categoria: { type: 'string' },
          preco: { type: 'number' },
          estoque: { type: 'integer' },
        },
      },
    },
  },
  paths: {
    '/produtos': {
      get: {
        summary: 'Lista todos os produtos',
        tags: ['Produtos'],
        responses: {
          200: {
            description: 'Lista de produtos retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Produto' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Cria um novo produto',
        tags: ['Produtos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  categoria: { type: 'string' },
                  preco: { type: 'number' },
                  estoque: { type: 'integer' },
                },
                required: ['nome', 'preco', 'estoque'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Produto criado com sucesso',
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [], // Deixamos vazio para ele NÃO ler comentários e não dar erro
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROTAS (Agora sem comentários complexos para não quebrar) ---

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/produtos', async (req, res) => {
  const { nome, categoria, preco, estoque } = req.body;
  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        categoria,
        preco,
        estoque: Number(estoque)
      }
    });
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Prisma rodando em http://localhost:${PORT}`);
  console.log(`📄 Acesse o Swagger sem erros em: http://localhost:${PORT}/api-docs\n`);
});
