import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController.js'; 
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';

const routes = Router();
const produtoController = new ProdutoController(); 

/** @swagger 
 * /produtos: 
 * get: 
 * summary: Lista todos os produtos 
 * tags: [Produtos] */
routes.get('/produtos', produtoController.listar);

/** @swagger 
 * /produtos: 
 * post: 
 * summary: Cadastra produto e estoque inicial 
 * tags: [Produtos] */
routes.post('/produtos', produtoController.criar);

/** @swagger 
 * /produtos/{id}: 
 * put: 
 * summary: Atualiza dados do produto 
 * tags: [Produtos] */
routes.put('/produtos/:id', produtoController.atualizar);

/** @swagger 
 * /produtos/{id}: 
 * delete: 
 * summary: Remove produto e histórico 
 * tags: [Produtos] */
routes.delete('/produtos/:id', produtoController.deletar);

/** @swagger 
 * /movimentacoes: 
 * get: 
 * summary: Histórico de entradas e saídas 
 * tags: [Movimentações] */
routes.get('/movimentacoes', MovimentacaoController.index);

/** @swagger 
 * /movimentacoes: 
 * post: 
 * summary: Registra nova movimentação 
 * tags: [Movimentações] */
routes.post('/movimentacoes', MovimentacaoController.store);

/** @swagger 
 * /dashboard: 
 * get: 
 * summary: Indicadores financeiros e alertas 
 * tags: [Dashboard] */
routes.get('/dashboard', DashboardController.resumo);

export { routes };