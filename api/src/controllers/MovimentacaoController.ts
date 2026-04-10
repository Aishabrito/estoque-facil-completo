import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export default {
  async index(_req: Request, res: Response): Promise<Response> {
    try {
      const movimentacoes = await prisma.movimentacao.findMany({
        orderBy: { data: 'desc' },
        include: {
          produto: true,
          usuario: {
            select: { id: true, nome: true, isAdmin: true }
          }
        }
      });
      return res.json(movimentacoes);
    } catch {
      return res.status(500).json({ error: "Erro ao buscar histórico." });
    }
  },

  async store(req: Request, res: Response): Promise<Response> {
    const { produtoId, tipo, qtd, reason, motivo } = req.body as {
      produtoId: string | number;
      tipo: string;
      qtd: string | number;
      reason?: string;
      motivo?: string;
    };

    const id = Number(produtoId);
    const quantidade = Math.abs(Number(qtd));
    const tipoFormatado = tipo ? String(tipo).trim().toUpperCase() : '';
    const motivoFinal = motivo || reason || 'Movimentação manual';
    const usuarioId = req.usuarioId;

    if (!id || !quantidade || !tipoFormatado) {
      return res.status(400).json({ error: "Dados incompletos (ID, Tipo e Qtd são obrigatórios)." });
    }

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const produto = await tx.produto.findUnique({ where: { id } });
        if (!produto) throw new Error("Produto não encontrado.");

        let operacao: { increment: number } | { decrement: number };
        if (tipoFormatado === 'ENTRADA') {
          operacao = { increment: quantidade };
        } else if (tipoFormatado === 'SAIDA') {
          if (Number(produto.estoque) < quantidade) {
            throw new Error(`Saldo insuficiente. Estoque atual: ${produto.estoque}`);
          }
          operacao = { decrement: quantidade };
        } else {
          throw new Error(`Tipo inválido: ${tipoFormatado}`);
        }

        const mov = await tx.movimentacao.create({
          data: {
            produtoId: id,
            tipo: tipoFormatado,
            qtd: quantidade,
            motivo: motivoFinal,
            usuarioId: usuarioId ?? null,
          }
        });

        const produtoAtualizado = await tx.produto.update({
          where: { id },
          data: { estoque: operacao }
        });

        return { mov, saldoAtual: produtoAtualizado.estoque };
      });

      return res.status(201).json(resultado);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
};
