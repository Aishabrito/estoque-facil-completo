import { Router } from 'express';

// IMPORTANTE:
// 1. Removemos as chaves { } porque agora é "export default"
// 2. Se o ProdutoController ainda for Class, mantenha como estava. 
//    Mas Movimentacao e Dashboard agora são objetos diretos.
import { ProdutoController } from '../controllers/ProdutoController.js'; 
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';

const routes = Router();

// --- INSTÂNCIAS ---
// Apenas ProdutoController precisa de "new" se ele ainda for uma Class.
// Movimentacao e Dashboard já vêm prontos para uso.
const produtoController = new ProdutoController(); 


// --- ROTAS DE PRODUTOS ---
// (Mantive igual, assumindo que você não mudou esse arquivo ainda)
routes.get('/produtos', produtoController.listar);
routes.post('/produtos', produtoController.criar);
routes.put('/produtos/:id', produtoController.atualizar);
routes.delete('/produtos/:id', produtoController.deletar);


// --- ROTAS DE MOVIMENTAÇÕES (ATUALIZADO) ---
// Note que usamos .index e .store agora, e chamamos direto o import
routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', MovimentacaoController.store);


// --- DASHBOARD (ATUALIZADO) ---
routes.get('/dashboard', DashboardController.resumo);

export { routes };