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
