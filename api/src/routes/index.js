import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController.js'; 
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const routes = Router();
const produtoController = new ProdutoController(); 

// ==========================================
// 🔓 ROTAS PÚBLICAS
// ==========================================
routes.post('/login', AuthController.login);

// ==========================================
// 🛡️ BARREIRA DE SEGURANÇA GERAL (JWT)
// ==========================================
routes.use(authMiddleware.verificarToken);

// ==========================================
// 🔒 ROTAS PROTEGIDAS (Para toda a equipe)
// ==========================================
routes.get('/me', AuthController.me); // Check-up de login
routes.get('/dashboard', DashboardController.resumo);

routes.get('/produtos', produtoController.listar);
routes.post('/produtos', produtoController.criar);
routes.put('/produtos/:id', produtoController.atualizar);
routes.delete('/produtos/:id', produtoController.deletar);

routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', MovimentacaoController.store);

// ==========================================
// 👑 ROTAS EXCLUSIVAS DE ADMIN (Apenas o Chefe)
// ==========================================
routes.post('/usuarios', authMiddleware.verificarAdmin, AuthController.registrar);

export { routes };