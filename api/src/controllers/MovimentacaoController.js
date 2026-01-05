import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class MovimentacaoController {
  
  async listar(req, res) {
    try {
      const historico = await prisma.movimentacao.findMany({
        orderBy: { data: 'desc' },
        include: { produto: { select: { nome: true } } }
      });
      return res.json(historico);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async criar(req, res) {
    const { produtoId, tipo, qtd } = req.body;

    // --- CORREÇÃO DE SEGURANÇA ---
    // Força virar maiúsculo para garantir que o IF funcione
    const tipoFormatado = tipo.toUpperCase(); 
    // -----------------------------

    try {
      const produtoAlvo = await prisma.produto.findUnique({
        where: { id: Number(produtoId) }
      });

      if (!produtoAlvo) {
        return res.status(404).json({ error: "Produto não encontrado no sistema." });
      }

      // Agora usa 'tipoFormatado'
      if (tipoFormatado === 'SAIDA' && produtoAlvo.estoque < Number(qtd)) {
        return res.status(400).json({ 
          error: `Saldo insuficiente. Estoque atual: ${produtoAlvo.estoque}, Tentativa de saída: ${qtd}` 
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const mov = await tx.movimentacao.create({
          data: { 
              produtoId: Number(produtoId), 
              tipo: tipoFormatado, // Salva no banco padronizado (ENTRADA/SAIDA)
              qtd: Number(qtd) 
          }
        });

        // Usa 'tipoFormatado' para decidir a conta matemática
        const operacao = tipoFormatado === 'ENTRADA' ? { increment: Number(qtd) } : { decrement: Number(qtd) };
        
        const produtoAtualizado = await tx.produto.update({
          where: { id: Number(produtoId) },
          data: { estoque: operacao }
        });

        return { mov, saldoAtual: produtoAtualizado.estoque };
      });

      return res.status(201).json(resultado);

    } catch (err) {
      return res.status(500).json({ error: "Erro crítico na movimentação: " + err.message });
    }
  }
}