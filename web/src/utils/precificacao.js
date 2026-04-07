/**
 * Fórmula do Markup Divisor — como empresas reais calculam.
 * Preço = Custo / (1 - (margem + impostos + custoOp) / 100)
 * Garante que a margem é real sobre o preço de venda, não sobre o custo.
 */
export function calcularPrecoSugerido({ precoCusto, margemLucro, impostos, custoOperacional }) {
  const custo = Number(precoCusto) || 0;
  const totalDesconto = (Number(margemLucro) + Number(impostos) + Number(custoOperacional)) / 100;

  if (totalDesconto >= 1) return 0; // Inviável — percentuais somam 100% ou mais

  const precoSugerido = custo / (1 - totalDesconto);
  return precoSugerido;
}

export function calcularLucroLiquido({ precoCusto, precoVenda, impostos, custoOperacional }) {
  const custo = Number(precoCusto) || 0;
  const venda = Number(precoVenda) || 0;
  const descontos = ((Number(impostos) + Number(custoOperacional)) / 100) * venda;
  return venda - custo - descontos;
}

export function classificarMargem(margem) {
  if (margem < 10) return { label: 'Margem crítica', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  if (margem < 20) return { label: 'Margem baixa', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
  if (margem < 35) return { label: 'Margem saudável', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  return { label: 'Margem excelente', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
}