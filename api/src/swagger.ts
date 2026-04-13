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
  },
  apis: ['./src/routes/swagger-comments.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);