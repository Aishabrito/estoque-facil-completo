import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

const registroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export default {
  async me(req, res) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.usuarioId },
        select: { id: true, nome: true, email: true, isAdmin: true }
      });
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao validar sessão.' });
    }
  },
async atualizarPerfil(req, res) {
  try {
    const { nome, email, senhaAtual, novaSenha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    let senhaHash = usuario.senhaHash;

    if (novaSenha) {
      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senhaHash);
      if (!senhaValida) return res.status(400).json({ error: 'Senha atual incorreta.' });
      const salt = await bcrypt.genSalt(10);
      senhaHash = await bcrypt.hash(novaSenha, salt);
    }

    const atualizado = await prisma.usuario.update({
      where: { id: req.usuarioId },
      data: { nome, email, senhaHash },
      select: { id: true, nome: true, email: true, isAdmin: true },
    });

    return res.json(atualizado);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
},
  async registrar(req, res) {
    try {
      const { nome, email, senha } = registroSchema.parse(req.body);

      const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      const totalUsuarios = await prisma.usuario.count();
      const isAdmin = totalUsuarios === 0;

      const salt = await bcrypt.genSalt(10);
      const hashGerado = await bcrypt.hash(senha, salt);

      const novoUsuario = await prisma.usuario.create({
        data: { nome, email, senhaHash: hashGerado, isAdmin } 
      });

      return res.status(201).json({
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        isAdmin: novoUsuario.isAdmin,
        mensagem: isAdmin ? 'Primeiro Admin criado!' : 'Usuário criado!'
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
      
      if (!senhaValida) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const token = jwt.sign(
        { id: usuario.id, isAdmin: usuario.isAdmin }, 
        process.env.JWT_SECRET || 'segredo_padrao_para_desenvolvimento', 
        { expiresIn: '1d' }
      );

      return res.json({
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin },
        token
      });

    } catch (error) {
      console.error("🔥 ERRO REAL NO LOGIN:", error);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  },

  // 💡 FUNÇÃO NOVA: Para listar a equipe no painel Admin
  async listarUsuarios(req, res) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, nome: true, email: true, isAdmin: true, criadoEm: true },
        orderBy: { criadoEm: 'desc' }
      });
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar equipe.' });
    }
  }
};