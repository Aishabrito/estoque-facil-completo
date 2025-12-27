import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController.js';
import { MovimentacaoController } from '../controllers/MovimentacaoController.js';
import { DashboardController } from '../controllers/DashboardController.js';

const routes = Router();

// Instâncias dos Controllers (Vamos criar já já)
const produtoController = new ProdutoController();
const movController = new MovimentacaoController();
const dashController = new DashboardController();

// --- ROTAS DE PRODUTOS ---
routes.get('/produtos', produtoController.listar);
routes.post('/produtos', produtoController.criar);
routes.put('/produtos/:id', produtoController.atualizar);
routes.delete('/produtos/:id', produtoController.deletar);

// --- ROTAS DE MOVIMENTAÇÕES ---
routes.get('/movimentacoes', movController.listar);
routes.post('/movimentacoes', movController.criar);

// --- DASHBOARD ---
routes.get('/dashboard', dashController.resumo);

export { routes };