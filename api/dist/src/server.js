import express from 'express';
import cors from 'cors';
import { Router } from 'express';
import { ProdutoController } from './controllers/ProdutoController.js';
import MovimentacaoController from './controllers/MovimentacaoController.js';
import DashboardController from './controllers/DashboardController.js';
import { swaggerSpec } from './swagger.js';
const routes = Router();
const produtoController = new ProdutoController();
routes.get('/produtos', produtoController.listar.bind(produtoController));
routes.post('/produtos', produtoController.criar.bind(produtoController));
routes.put('/produtos/:id', produtoController.atualizar.bind(produtoController));
routes.delete('/produtos/:id', produtoController.deletar.bind(produtoController));
routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', MovimentacaoController.store);
routes.get('/dashboard', DashboardController.resumo);
const app = express();
app.use(cors());
app.use(express.json());
// Documentação Swagger (Mantida!)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log('Swagger spec loaded:', swaggerSpec);
// Rotas do sistema
app.use(routes);
// Tratamento de Erros Centralizado
app.use((err, _req, res, _next) => {
    console.error('❌ Erro detectado:', err.message);
    if (err.code === 'P2002') {
        return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }
    return res.status(500).json({
        error: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
    });
});
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`\n🚀 API rodando em http://localhost:${PORT}`);
});
