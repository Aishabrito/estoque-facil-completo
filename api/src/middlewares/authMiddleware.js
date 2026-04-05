import jwt from 'jsonwebtoken';

export default {
  // 1. Verifica se a pessoa tem a chave para entrar no sistema
  verificarToken(req, res, next) {
    // O token geralmente vem no cabeçalho (Header) da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    // O padrão é vir escrito "Bearer meutoken123", então separamos para pegar só o token
    const [, token] = authHeader.split(' ');

    try {
      // Tenta decifrar o token usando a sua senha secreta do .env
      const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'segredo_padrao_para_desenvolvimento');
      
      // Guarda os dados do usuário (id, isAdmin) dentro da requisição para as próximas funções usarem
      req.usuarioId = decodificado.id;
      req.isAdmin = decodificado.isAdmin;

      return next(); // Pode passar!
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
  },

  // 2. Verifica se a pessoa é O CHEFE (Admin)
  verificarAdmin(req, res, next) {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }
    return next(); // É o chefe, pode passar!
  }
};