import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { ProdutoController } from '../controllers/ProdutoController.js';
import AuthController from '../controllers/AuthController.js';
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import DashboardController from '../controllers/DashboardController.js';
import ConfiguracoesController from '../controllers/ConfiguracoesController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import VendaController from '../controllers/VendaController.js';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();

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

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Retorna indicadores financeiros e de estoque
 *     description: >
 *       Calcula e retorna um resumo completo do negócio: valor patrimonial do estoque,
 *       receita e lucro potenciais, total de vendas do mês, alertas de baixo estoque e
 *       as 10 últimas movimentações registradas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Indicadores calculados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItens:
 *                   type: integer
 *                   description: Soma de todas as unidades em estoque
 *                   example: 342
 *                 totalCategorias:
 *                   type: integer
 *                   description: Número de categorias distintas cadastradas
 *                   example: 8
 *                 valorPatrimonial:
 *                   type: number
 *                   format: decimal
 *                   description: Valor total do estoque calculado pelo preço de custo
 *                   example: 15800.50
 *                 receitaPotencial:
 *                   type: number
 *                   format: decimal
 *                   description: Receita estimada caso todo o estoque seja vendido
 *                   example: 28900.00
 *                 lucroEstimado:
 *                   type: number
 *                   format: decimal
 *                   description: Lucro potencial (receitaPotencial - valorPatrimonial)
 *                   example: 13099.50
 *                 baixoEstoque:
 *                   type: integer
 *                   description: Quantidade de produtos abaixo do estoque mínimo
 *                   example: 3
 *                 totalVendasMes:
 *                   type: number
 *                   format: decimal
 *                   description: Soma do valor de todas as vendas do mês corrente
 *                   example: 4250.00
 *                 movimentacoes:
 *                   type: array
 *                   description: As 10 movimentações mais recentes
 *                   items:
 *                     $ref: '#/components/schemas/Movimentacao'
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao calcular indicadores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Dashboard (Indicadores e Faturamento Mensal)
routes.get('/dashboard', DashboardController.resumo);

// Configurações do Sistema
routes.get('/configuracoes', ConfiguracoesController.buscar);
routes.put('/configuracoes', verificarAdmin, ConfiguracoesController.atualizar);
routes.delete('/configuracoes/resetar', verificarAdmin, ConfiguracoesController.resetar);

/**
 * @swagger
 * /produtos:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista todos os produtos cadastrados
 *     description: Retorna o catálogo completo de produtos ordenado pelo ID decrescente.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *             example:
 *               - id: 5
 *                 nome: "Arroz 5kg"
 *                 categoria: "Alimentos"
 *                 precoCusto: 18.50
 *                 preco: 28.90
 *                 estoque: 40
 *                 estoqueMinimo: 10
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao buscar lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Produtos]
 *     summary: Cadastra um novo produto
 *     description: >
 *       Cria um produto no catálogo. Caso um estoque inicial seja informado, uma movimentação
 *       de ENTRADA é registrada automaticamente com o motivo "Saldo Inicial de Cadastro".
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto (obrigatório)
 *                 example: "Feijão Carioca 1kg"
 *               categoria:
 *                 type: string
 *                 description: Categoria do produto (padrão "Geral" se omitido)
 *                 example: "Alimentos"
 *               precoCusto:
 *                 type: number
 *                 description: Preço de custo unitário
 *                 example: 5.20
 *               preco:
 *                 type: number
 *                 description: Preço de venda unitário (obrigatório)
 *                 example: 8.99
 *               estoque:
 *                 type: integer
 *                 description: Quantidade inicial em estoque (padrão 0)
 *                 example: 100
 *               estoqueMinimo:
 *                 type: integer
 *                 description: Nível mínimo para alerta de reposição (padrão 5)
 *                 example: 20
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos — nome e preço são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Nome e Preço de Venda são obrigatórios."
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao criar produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /produtos/{id}:
 *   put:
 *     tags: [Produtos]
 *     summary: Atualiza os dados de um produto
 *     description: >
 *       Permite editar nome, categoria, preço de custo, preço de venda e estoque mínimo.
 *       O estoque atual só pode ser ajustado via movimentações.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID numérico do produto
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Feijão Preto 1kg"
 *               categoria:
 *                 type: string
 *                 example: "Alimentos"
 *               precoCusto:
 *                 type: number
 *                 example: 5.50
 *               preco:
 *                 type: number
 *                 example: 9.49
 *               estoqueMinimo:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao atualizar produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Produtos]
 *     summary: Remove um produto e todo o seu histórico de movimentações
 *     description: >
 *       Exclui o produto e todas as movimentações vinculadas a ele em uma única transação.
 *       **Esta ação é irreversível.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID numérico do produto a ser excluído
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Produto e histórico removidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto e histórico removidos."
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao deletar produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Produtos
routes.get('/produtos', produtoController.listar.bind(produtoController));
routes.post('/produtos', produtoController.criar.bind(produtoController));
routes.put('/produtos/:id', produtoController.atualizar.bind(produtoController));
routes.delete('/produtos/:id', produtoController.deletar.bind(produtoController));

// Vendas
routes.get('/vendas', VendaController.listar);
routes.post('/vendas', VendaController.criar);

/**
 * @swagger
 * /movimentacoes:
 *   get:
 *     tags: [Movimentações]
 *     summary: Lista todo o histórico de entradas e saídas de estoque
 *     description: >
 *       Retorna todas as movimentações em ordem decrescente de data, incluindo
 *       os dados do produto e do usuário responsável pelo registro.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico de movimentações retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movimentacao'
 *             example:
 *               - id: 12
 *                 tipo: "ENTRADA"
 *                 qtd: 50
 *                 motivo: "Reposição de estoque"
 *                 data: "2024-06-01T10:30:00.000Z"
 *                 produtoId: 3
 *                 produto:
 *                   id: 3
 *                   nome: "Arroz 5kg"
 *                 usuario:
 *                   id: 1
 *                   nome: "Admin"
 *                   isAdmin: true
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao buscar histórico
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Movimentações]
 *     summary: Registra uma entrada ou saída manual de estoque
 *     description: >
 *       Cria uma movimentação e atualiza o saldo do produto automaticamente.
 *       Para SAIDA, o sistema valida se há saldo suficiente antes de registrar.
 *       O usuário autenticado é associado à movimentação.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produtoId
 *               - tipo
 *               - qtd
 *             properties:
 *               produtoId:
 *                 type: integer
 *                 description: ID do produto a ser movimentado
 *                 example: 3
 *               tipo:
 *                 type: string
 *                 enum: [ENTRADA, SAIDA]
 *                 description: Tipo da movimentação
 *                 example: "ENTRADA"
 *               qtd:
 *                 type: integer
 *                 description: Quantidade a ser movimentada (valor absoluto)
 *                 example: 20
 *               motivo:
 *                 type: string
 *                 description: Motivo ou observação da movimentação
 *                 example: "Reposição semanal"
 *     responses:
 *       201:
 *         description: Movimentação registrada e estoque atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mov:
 *                   $ref: '#/components/schemas/Movimentacao'
 *                 saldoAtual:
 *                   type: integer
 *                   description: Saldo do produto após a movimentação
 *                   example: 60
 *       400:
 *         description: Dados inválidos ou saldo insuficiente para SAIDA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Saldo insuficiente. Estoque atual: 5"
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao registrar movimentação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

// ==========================================
// ⏰ ROTA DE KEEP-ALIVE (Evita hibernação)
// ==========================================
routes.get('/keep-alive', async (req, res) => { 
  try {
    // Faz uma consulta super leve no banco (pega só 1 usuário)
    // Isso conta como "atividade" para o Supabase
    await prisma.usuario.findFirst(); 
    
    return res.status(200).json({ status: 'API e Banco estão vivos!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao conectar no banco' });
  }
});

export default routes;
