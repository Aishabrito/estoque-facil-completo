import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

// Definimos como os dados vêm dentro do Token
interface JwtPayload {
  id: number;
  isAdmin: boolean;
}

// Criamos um novo tipo de Request que "estende" o original do Express
// Isso avisa ao TypeScript que o NOSSO 'req' tem usuarioId e isAdmin
interface CustomRequest extends Request {
  usuarioId?: number;
  isAdmin?: boolean;
}

// 1. Verifica se a pessoa tem a chave para entrar no sistema
export const verificarToken = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET || 'segredo_padrao_para_desenvolvimento';
    
    // Tenta decifrar o token
    const decodificado = jwt.verify(token, secret) as JwtPayload;
    req.usuarioId = decodificado.id;
    req.isAdmin = decodificado.isAdmin;

    return next(); 
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// 2. Verifica se a pessoa é  (Admin)
export const verificarAdmin = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }
  return next(); 
};