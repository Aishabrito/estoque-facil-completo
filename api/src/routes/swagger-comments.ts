/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Autenticar usuário
 *     description: >
 *       Valida as credenciais (e-mail e senha) e retorna um token JWT para ser usado
 *       no cabeçalho Authorization das demais rotas protegidas.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail cadastrado do usuário
 *                 example: demo@estoquefacil.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: demo123
 *     responses:
 *       200:
 *         description: Login bem-sucedido — retorna token JWT e dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação nas próximas requisições
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas — e-mail ou senha incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Credenciais inválidas."
 *       429:
 *         description: Muitas tentativas de login — tente novamente em 15 minutos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Muitas tentativas de login. Tente novamente em 15 minutos."
 *       500:
 *         description: Erro interno ao processar o login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /me:
 *   get:
 *     tags: [Auth]
 *     summary: Retorna dados do usuário logado
 *     description: >
 *       Decodifica o token JWT do cabeçalho Authorization e retorna os dados
 *       completos do usuário autenticado (sem a senha).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *             example:
 *               id: 1
 *               nome: "Ana Lima"
 *               email: "ana@estoquefacil.com"
 *               isAdmin: true
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao buscar dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Auth]
 *     summary: Atualiza o próprio perfil
 *     description: >
 *       Permite que o próprio usuário altere seu nome, e-mail ou senha.
 *       Para trocar a senha, é obrigatório informar a senha atual para validação.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário
 *                 example: "Ana Lima Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo e-mail do usuário
 *                 example: "ana.silva@estoquefacil.com"
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual (obrigatória para trocar de senha)
 *                 example: "demo123"
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha desejada
 *                 example: "novaSenha456"
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Senha atual incorreta ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Senha atual incorreta."
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao atualizar perfil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags: [Usuários]
 *     summary: Lista membros da equipe (Admin)
 *     description: >
 *       Retorna todos os usuários cadastrados no sistema. Acesso restrito a administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *             example:
 *               - id: 1
 *                 nome: "Ana Lima"
 *                 email: "ana@estoquefacil.com"
 *                 isAdmin: true
 *               - id: 2
 *                 nome: "Carlos Vendas"
 *                 email: "carlos@estoquefacil.com"
 *                 isAdmin: false
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado — apenas administradores podem listar usuários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Acesso negado."
 *       500:
 *         description: Erro interno ao listar usuários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Usuários]
 *     summary: Cria novo membro da equipe (Admin)
 *     description: >
 *       Cadastra um novo usuário no sistema. Acesso restrito a administradores.
 *       A senha é armazenada com hash bcrypt.
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
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do novo usuário
 *                 example: "Carlos Vendas"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do novo usuário (deve ser único)
 *                 example: "carlos@estoquefacil.com"
 *               senha:
 *                 type: string
 *                 description: Senha inicial do usuário
 *                 example: "senha123"
 *               isAdmin:
 *                 type: boolean
 *                 description: Indica se o usuário terá permissões de administrador (padrão false)
 *                 example: false
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: E-mail já cadastrado ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Este e-mail já está em uso."
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado — apenas administradores podem criar usuários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao criar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags: [Usuários]
 *     summary: Edita membro da equipe (Admin)
 *     description: >
 *       Atualiza nome, e-mail ou nível de acesso (isAdmin) de um usuário existente.
 *       Acesso restrito a administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID numérico do usuário a ser editado
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário
 *                 example: "Carlos Eduardo"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo e-mail do usuário
 *                 example: "carlos.eduardo@estoquefacil.com"
 *               isAdmin:
 *                 type: boolean
 *                 description: Promove ou rebaixa o nível de acesso do usuário
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado — apenas administradores podem editar usuários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao atualizar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Usuários]
 *     summary: Remove membro da equipe (Admin)
 *     description: >
 *       Exclui permanentemente um usuário do sistema. Acesso restrito a administradores.
 *       **Esta ação é irreversível.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID numérico do usuário a ser removido
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado — apenas administradores podem remover usuários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao remover usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
 */

/**
 * @swagger
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

/**
 * @swagger
 * /vendas:
 *   get:
 *     tags: [Vendas]
 *     summary: Lista todas as vendas registradas
 *     description: >
 *       Retorna o histórico completo de vendas em ordem decrescente de data,
 *       incluindo os itens de cada venda e os produtos correspondentes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vendas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venda'
 *             example:
 *               - id: 10
 *                 total: 57.80
 *                 formaPagamento: "PIX"
 *                 data: "2024-06-15T14:22:00.000Z"
 *                 itens:
 *                   - produtoId: 5
 *                     quantidade: 2
 *                     precoNoMomento: 28.90
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao buscar vendas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Vendas]
 *     summary: Registra uma nova venda (PDV)
 *     description: >
 *       Cria uma venda com um ou mais itens. Para cada item vendido, o estoque do produto
 *       é reduzido automaticamente. O total da venda é calculado pela soma dos itens.
 *       Requer que todos os produtos tenham estoque suficiente.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formaPagamento
 *               - itens
 *             properties:
 *               formaPagamento:
 *                 type: string
 *                 enum: [PIX, CARTAO, DINHEIRO]
 *                 description: Forma de pagamento utilizada na venda
 *                 example: "PIX"
 *               itens:
 *                 type: array
 *                 description: Lista de produtos vendidos
 *                 items:
 *                   type: object
 *                   required:
 *                     - produtoId
 *                     - quantidade
 *                     - precoNoMomento
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                       description: ID do produto vendido
 *                       example: 5
 *                     quantidade:
 *                       type: integer
 *                       description: Quantidade vendida
 *                       example: 2
 *                     precoNoMomento:
 *                       type: number
 *                       description: Preço unitário no momento da venda
 *                       example: 28.90
 *     responses:
 *       201:
 *         description: Venda registrada com baixa automática no estoque
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos ou estoque insuficiente para algum produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Estoque insuficiente para o produto: Arroz 5kg"
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao registrar a venda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /configuracoes:
 *   get:
 *     tags: [Configurações]
 *     summary: Retorna parâmetros de precificação
 *     description: >
 *       Retorna as configurações atuais de precificação do sistema,
 *       incluindo margem de lucro, impostos e custo operacional.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações atuais retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 margemLucro:
 *                   type: number
 *                   description: Margem de lucro em percentual
 *                   example: 30
 *                 impostos:
 *                   type: number
 *                   description: Percentual de impostos aplicado
 *                   example: 15
 *                 custoOperacional:
 *                   type: number
 *                   description: Percentual de custo operacional
 *                   example: 10
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao buscar configurações
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Configurações]
 *     summary: Atualiza parâmetros de precificação (Admin)
 *     description: >
 *       Atualiza as configurações de precificação do sistema.
 *       Acesso restrito a administradores.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               margemLucro:
 *                 type: number
 *                 description: Nova margem de lucro em percentual
 *                 example: 30
 *               impostos:
 *                 type: number
 *                 description: Novo percentual de impostos
 *                 example: 15
 *               custoOperacional:
 *                 type: number
 *                 description: Novo percentual de custo operacional
 *                 example: 10
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 margemLucro:
 *                   type: number
 *                   example: 30
 *                 impostos:
 *                   type: number
 *                   example: 15
 *                 custoOperacional:
 *                   type: number
 *                   example: 10
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado — apenas administradores podem alterar configurações
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao atualizar configurações
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /configuracoes/resetar:
 *   delete:
 *     tags: [Configurações]
 *     summary: Reseta o banco de dados para os valores de fábrica (Admin)
 *     description: >
 *       Apaga todos os produtos, movimentações e vendas. Restaura as configurações
 *       de precificação para os valores padrão. Acesso restrito a administradores.
 *       **Ação irreversível.**
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Banco de dados resetado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Banco de dados resetado com sucesso."
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado — apenas administradores podem resetar o banco
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao resetar o banco de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export {};
