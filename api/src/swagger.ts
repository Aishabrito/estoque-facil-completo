import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Estoque Fácil API',
      version: '1.0.0',
      description:
        'API RESTful para o sistema ERP/PDV Estoque Fácil. Gerencia produtos, movimentações de estoque, vendas e usuários com controle de acesso por perfil (RBAC).',
    },
    servers: [
      { url: 'https://estoque-facil-completo.onrender.com', description: 'Produção' },
      { url: 'http://localhost:3002', description: 'Desenvolvimento local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Produto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            categoria: { type: 'string', nullable: true },
            precoCusto: { type: 'number', format: 'decimal' },
            preco: { type: 'number', format: 'decimal' },
            estoque: { type: 'integer' },
            estoqueMinimo: { type: 'integer' },
          },
        },
        Movimentacao: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            tipo: { type: 'string', enum: ['ENTRADA', 'SAIDA'] },
            qtd: { type: 'integer' },
            motivo: { type: 'string', nullable: true },
            data: { type: 'string', format: 'date-time' },
            produtoId: { type: 'integer' },
          },
        },
        Venda: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            total: { type: 'number', format: 'decimal' },
            formaPagamento: { type: 'string', enum: ['PIX', 'CARTAO', 'DINHEIRO'] },
            data: { type: 'string', format: 'date-time' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            isAdmin: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Autenticação e gestão de sessão' },
      { name: 'Produtos', description: 'Gestão do catálogo de produtos' },
      { name: 'Movimentações', description: 'Entradas e saídas de estoque' },
      { name: 'Vendas', description: 'PDV — Registro e consulta de vendas' },
      { name: 'Dashboard', description: 'Indicadores financeiros e de estoque' },
      { name: 'Usuários', description: 'Gestão de membros da equipe (Admin)' },
      { name: 'Configurações', description: 'Parâmetros de precificação do sistema' },
    ],
    paths: {
      // ─── AUTH ───────────────────────────────────────────────────────────
      '/login': {
        post: {
          tags: ['Auth'],
          summary: 'Autenticar usuário',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'senha'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'demo@estoquefacil.com' },
                    senha: { type: 'string', example: 'demo123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login bem-sucedido',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      usuario: { $ref: '#/components/schemas/Usuario' },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/me': {
        get: {
          tags: ['Auth'],
          summary: 'Retorna dados do usuário logado',
          responses: {
            200: { description: 'Dados do usuário', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
            401: { description: 'Não autenticado' },
          },
        },
        put: {
          tags: ['Auth'],
          summary: 'Atualiza o próprio perfil',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nome: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    senhaAtual: { type: 'string' },
                    novaSenha: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Perfil atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          },
        },
      },
      // ─── PRODUTOS ───────────────────────────────────────────────────────
      '/produtos': {
        get: {
          tags: ['Produtos'],
          summary: 'Lista todos os produtos',
          responses: {
            200: { description: 'Lista de produtos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Produto' } } } } },
          },
        },
        post: {
          tags: ['Produtos'],
          summary: 'Cria um novo produto',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'preco'],
                  properties: {
                    nome: { type: 'string' },
                    categoria: { type: 'string' },
                    precoCusto: { type: 'number' },
                    preco: { type: 'number' },
                    estoque: { type: 'integer' },
                    estoqueMinimo: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Produto criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
          },
        },
      },
      '/produtos/{id}': {
        put: {
          tags: ['Produtos'],
          summary: 'Atualiza dados de um produto',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Produto' } },
            },
          },
          responses: {
            200: { description: 'Produto atualizado' },
            404: { description: 'Produto não encontrado' },
          },
        },
        delete: {
          tags: ['Produtos'],
          summary: 'Exclui um produto e seu histórico',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'Produto excluído' },
            404: { description: 'Produto não encontrado' },
          },
        },
      },
      // ─── MOVIMENTAÇÕES ──────────────────────────────────────────────────
      '/movimentacoes': {
        get: {
          tags: ['Movimentações'],
          summary: 'Lista todo o histórico de entradas e saídas',
          responses: {
            200: { description: 'Lista de movimentações', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Movimentacao' } } } } },
          },
        },
        post: {
          tags: ['Movimentações'],
          summary: 'Registra uma entrada ou saída de estoque',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['tipo', 'qtd', 'produtoId'],
                  properties: {
                    tipo: { type: 'string', enum: ['ENTRADA', 'SAIDA'] },
                    qtd: { type: 'integer' },
                    motivo: { type: 'string' },
                    produtoId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Movimentação registrada' },
          },
        },
      },
      // ─── VENDAS ─────────────────────────────────────────────────────────
      '/vendas': {
        get: {
          tags: ['Vendas'],
          summary: 'Lista todas as vendas',
          responses: {
            200: { description: 'Lista de vendas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Venda' } } } } },
          },
        },
        post: {
          tags: ['Vendas'],
          summary: 'Registra uma nova venda (PDV)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['formaPagamento', 'itens'],
                  properties: {
                    formaPagamento: { type: 'string', enum: ['PIX', 'CARTAO', 'DINHEIRO'] },
                    itens: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          produtoId: { type: 'integer' },
                          quantidade: { type: 'integer' },
                          precoNoMomento: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Venda registrada com baixa automática no estoque' },
          },
        },
      },
      // ─── DASHBOARD ──────────────────────────────────────────────────────
      '/dashboard': {
        get: {
          tags: ['Dashboard'],
          summary: 'Retorna indicadores de patrimônio, lucro e alertas de reposição',
          responses: {
            200: {
              description: 'Resumo do dashboard',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalProdutos: { type: 'integer' },
                      valorTotalEstoque: { type: 'number' },
                      receitaPotencial: { type: 'number' },
                      lucroPotencial: { type: 'number' },
                      produtosAbaixoMinimo: { type: 'array', items: { $ref: '#/components/schemas/Produto' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // ─── USUÁRIOS ───────────────────────────────────────────────────────
      '/usuarios': {
        get: {
          tags: ['Usuários'],
          summary: 'Lista membros da equipe (Admin)',
          responses: {
            200: { description: 'Lista de usuários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Usuario' } } } } },
            403: { description: 'Acesso negado' },
          },
        },
        post: {
          tags: ['Usuários'],
          summary: 'Cria novo membro da equipe (Admin)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'email', 'senha'],
                  properties: {
                    nome: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    senha: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          },
        },
      },
      '/usuarios/{id}': {
        put: {
          tags: ['Usuários'],
          summary: 'Edita membro da equipe (Admin)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { nome: { type: 'string' }, email: { type: 'string' }, isAdmin: { type: 'boolean' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Usuário atualizado' }, 403: { description: 'Acesso negado' } },
        },
        delete: {
          tags: ['Usuários'],
          summary: 'Remove membro da equipe (Admin)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'Usuário removido' }, 403: { description: 'Acesso negado' } },
        },
      },
      // ─── CONFIGURAÇÕES ──────────────────────────────────────────────────
      '/configuracoes': {
        get: {
          tags: ['Configurações'],
          summary: 'Retorna parâmetros de precificação',
          responses: {
            200: {
              description: 'Configurações atuais',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      margemLucro: { type: 'number' },
                      impostos: { type: 'number' },
                      custoOperacional: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['Configurações'],
          summary: 'Atualiza parâmetros de precificação (Admin)',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    margemLucro: { type: 'number', example: 30 },
                    impostos: { type: 'number', example: 15 },
                    custoOperacional: { type: 'number', example: 10 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Configurações atualizadas' }, 403: { description: 'Acesso negado' } },
        },
      },
      '/configuracoes/resetar': {
        delete: {
          tags: ['Configurações'],
          summary: 'Reseta o banco de dados para os valores de fábrica (Admin)',
          description: 'Apaga todos os produtos, movimentações e vendas. Restaura as configurações de precificação para os valores padrão. **Ação irreversível.**',
          responses: {
            200: { description: 'Banco resetado com sucesso' },
            403: { description: 'Acesso negado — apenas admins' },
            500: { description: 'Erro interno ao resetar' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
import express from 'express';
import cors from 'cors';
import { Router } from 'express';
import { ProdutoController } from './controllers/ProdutoController.js';
import MovimentacaoController from './controllers/MovimentacaoController.js';
import DashboardController from './controllers/DashboardController.js';

// Swagger spec placeholder — swagger-jsdoc would be configured here
export const swaggerSpec = {};

const routes = Router();
const produtoController = new ProdutoController();

/**
 * @swagger
 * /produtos:
 * get:
 * summary: Lista todos os produtos
 * tags: [Produtos]
 */
routes.get('/produtos', produtoController.listar.bind(produtoController));

/**
 * @swagger
 * /produtos:
 * post:
 * summary: Cria um novo produto com estoque inicial
 * tags: [Produtos]
 */
routes.post('/produtos', produtoController.criar.bind(produtoController));

/**
 * @swagger
 * /produtos/{id}:
 * put:
 * summary: Atualiza dados de um produto
 * tags: [Produtos]
 */
routes.put('/produtos/:id', produtoController.atualizar.bind(produtoController));

/**
 * @swagger
 * /produtos/{id}:
 * delete:
 * summary: Exclui um produto e seu histórico
 * tags: [Produtos]
 */
routes.delete('/produtos/:id', produtoController.deletar.bind(produtoController));

/**
 * @swagger
 * /movimentacoes:
 * get:
 * summary: Lista todo o histórico de entradas e saídas
 * tags: [Movimentações]
 */
routes.get('/movimentacoes', MovimentacaoController.index);

/**
 * @swagger
 * /movimentacoes:
 * post:
 * summary: Registra uma nova entrada ou saída de estoque
 * tags: [Movimentações]
 */
routes.post('/movimentacoes', MovimentacaoController.store);

/**
 * @swagger
 * /dashboard:
 * get:
 * summary: Retorna indicadores de patrimônio, lucro e alertas
 * tags: [Dashboard]
 */
routes.get('/dashboard', DashboardController.resumo);

export { routes };

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 API Profissional rodando em http://localhost:${PORT}`);
});
