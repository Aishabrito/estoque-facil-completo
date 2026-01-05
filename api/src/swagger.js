import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Estoque Fácil API 📦',
      version: '3.0.0',
      description: 'API profissional para controle de estoque e movimentações',
    },
    servers: [{ url: 'http://localhost:3002' }],
  },
  // O Swagger vai ler as rotas para gerar a documentação automaticamente
  apis: ['./src/routes/*.js'], 
};

export const swaggerSpec = swaggerJsdoc(options);