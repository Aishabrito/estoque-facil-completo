import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { ProdutoController } from '../controllers/ProdutoController.js';
import AuthController from '../controllers/AuthController.js';
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';
import ConfiguracoesController from '../controllers/ConfiguracoesController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import VendaController from '../controllers/VendaController.js';

const routes = Router();
const produtoController = new ProdutoController();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

// ==========================================
// 🔓 ROTAS PÚBLICAS
// ==========================================
routes.post('/login', loginLimiter, AuthController.login);

// ==========================================
// 🛡️ BARREIRA DE SEGURANÇA GERAL (JWT)
// ==========================================
routes.use(verificarToken);

// ==========================================
// 🔒 ROTAS PROTEGIDAS (Para toda a equipe)
// ==========================================
routes.get('/me', AuthController.me);
routes.put('/me', AuthController.atualizarPerfil);

// Dashboard (Indicadores e Faturamento Mensal)
routes.get('/dashboard', DashboardController.resumo);

// Configurações do Sistema
routes.get('/configuracoes', ConfiguracoesController.buscar);
routes.put('/configuracoes', verificarAdmin, ConfiguracoesController.atualizar);
routes.delete('/configuracoes/resetar', verificarAdmin, ConfiguracoesController.resetar);

// Produtos
routes.get('/produtos', produtoController.listar.bind(produtoController));
routes.post('/produtos', produtoController.criar.bind(produtoController));
routes.put('/produtos/:id', produtoController.atualizar.bind(produtoController));
routes.delete('/produtos/:id', produtoController.deletar.bind(produtoController));

// Vendas
routes.get('/vendas', VendaController.listar);
routes.post('/vendas', VendaController.criar);

// Movimentações de Estoque
routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', MovimentacaoController.store);

// ==========================================
// 👑 ROTAS EXCLUSIVAS DE ADMIN (Gestão de Equipe)
// ==========================================
// Listar membros da equipe
routes.get('/usuarios', verificarAdmin, AuthController.listarUsuarios);

// Criar novo membro da equipe (Admin criando Vendedor, por exemplo)
routes.post('/usuarios', verificarAdmin, AuthController.registrar);

// Editar membro da equipe
routes.put('/usuarios/:id', verificarAdmin, AuthController.atualizarUsuario);

// Excluir membro da equipe
routes.delete('/usuarios/:id', verificarAdmin, AuthController.excluirUsuario);

export default routes;
