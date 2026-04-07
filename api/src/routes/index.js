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

// Dashboard (Indicadores e Faturamento Mensal)
routes.get('/dashboard', DashboardController.resumo);

// Configurações do Sistema
routes.get('/configuracoes', ConfiguracoesController.buscar);
routes.put('/configuracoes', verificarAdmin, ConfiguracoesController.atualizar);

// Produtos
routes.get('/produtos', produtoController.listar);
routes.post('/produtos', produtoController.criar);
routes.put('/produtos/:id', produtoController.atualizar);
routes.delete('/produtos/:id', produtoController.deletar);

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

//Editar membro da equipe
routes.put('/usuarios/:id', verificarAdmin, AuthController.atualizarUsuario);

// Excluir membro da equipe
routes.delete('/usuarios/:id', verificarAdmin, AuthController.excluirUsuario);

export default routes;