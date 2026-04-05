import { Router } from 'express';

// 1. Importações limpas e sem duplicações
import { ProdutoController } from '../controllers/ProdutoController.js'; 
import AuthController from '../controllers/AuthController.js';
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';

// 2. Importando as duas funções de segurança do seu middleware
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';

const routes = Router();
const produtoController = new ProdutoController(); 

// ==========================================
// 🔓 ROTAS PÚBLICAS
// ==========================================
routes.post('/login', AuthController.login);

// ==========================================
// 🛡️ BARREIRA DE SEGURANÇA GERAL (JWT)
// ==========================================
// 3. Usa a função que importamos diretamente
routes.use(verificarToken);

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
routes.post('/usuarios', verificarAdmin, AuthController.registrar);

// ==========================================
// 👑 ROTAS EXCLUSIVAS DE ADMIN (Apenas o Chefe)
// ==========================================
routes.post('/usuarios', verificarAdmin, AuthController.registrar);

// 4. Exportação padrão para o seu api/index.js achar mais fácil
export default routes;