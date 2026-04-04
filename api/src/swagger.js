import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController.js'; 
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';

const routes = Router();
const produtoController = new ProdutoController(); 

/**
 * @swagger
 * /produtos:
 * get:
 * summary: Lista todos os produtos
 * tags: [Produtos]
 */
routes.get('/produtos', produtoController.listar);

/**
 * @swagger
 * /produtos:
 * post:
 * summary: Cria um novo produto com estoque inicial
 * tags: [Produtos]
 */
routes.post('/produtos', produtoController.criar);

/**
 * @swagger
 * /produtos/{id}:
 * put:
 * summary: Atualiza dados de um produto
 * tags: [Produtos]
 */
routes.put('/produtos/:id', produtoController.atualizar);

/**
 * @swagger
 * /produtos/{id}:
 * delete:
 * summary: Exclui um produto e seu histórico
 * tags: [Produtos]
 */
routes.delete('/produtos/:id', produtoController.deletar);

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