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
      { url: 'http://localhost:3000', description: 'Desenvolvimento local' },
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
  apis: ['./src/routes/index.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);