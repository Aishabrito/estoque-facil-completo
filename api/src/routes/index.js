import { Router } from 'express';

import { ProdutoController } from '../controllers/ProdutoController.js'; 
import AuthController from '../controllers/AuthController.js';
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';
import ConfiguracoesController from '../controllers/ConfiguracoesController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import VendaController from '../controllers/VendaController.js';

const routes = Router();
const produtoController = new ProdutoController(); 

// ==========================================
// 🔓 ROTAS PÚBLICAS
// ==========================================
routes.post('/login', AuthController.login);

// ==========================================
// 🛡️ BARREIRA DE SEGURANÇA GERAL (JWT)
// ==========================================
routes.use(verificarToken);

// ==========================================
// 🔒 ROTAS PROTEGIDAS (Para toda a equipe)
// ==========================================
routes.get('/me', AuthController.me); 
routes.put('/me', AuthController.atualizarPerfil);
routes.get('/dashboard', DashboardController.resumo);
routes.get('/configuracoes', ConfiguracoesController.buscar);
routes.put('/configuracoes', verificarAdmin, ConfiguracoesController.atualizar);
routes.get('/produtos', produtoController.listar);
routes.post('/produtos', produtoController.criar);
routes.put('/produtos/:id', produtoController.atualizar);
routes.delete('/produtos/:id', produtoController.deletar);
routes.get('/vendas', VendaController.listar);
routes.post('/vendas', VendaController.criar);
routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', MovimentacaoController.store);

// ==========================================
// 👑 ROTAS EXCLUSIVAS DE ADMIN (Apenas o Chefe)
// ==========================================
// 💡 Correção: Um GET para listar e um POST para registrar!
routes.get('/usuarios', verificarAdmin, AuthController.listarUsuarios);
routes.post('/usuarios', verificarAdmin, AuthController.registrar);

export default routes;