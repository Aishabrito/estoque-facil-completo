import { describe, it, expect } from 'vitest';
import {
  calcularPrecoSugerido,
  calcularLucroLiquido,
  classificarMargem,
} from '../utils/precificacao';

describe('calcularPrecoSugerido', () => {
  it('calcula o preço pelo Markup Divisor corretamente', () => {
    // Custo 100, margem 30%, impostos 15%, custoOp 10% → desconto total = 55%
    // preço = 100 / (1 - 0.55) = 100 / 0.45 ≈ 222.22
    const preco = calcularPrecoSugerido({ precoCusto: 100, margemLucro: 30, impostos: 15, custoOperacional: 10 });
    expect(preco).toBeCloseTo(222.22, 1);
  });

  it('retorna 0 quando os percentuais somam 100% ou mais', () => {
    const preco = calcularPrecoSugerido({ precoCusto: 100, margemLucro: 60, impostos: 25, custoOperacional: 20 });
    expect(preco).toBe(0);
  });

  it('trata valores não-numéricos como 0', () => {
    const preco = calcularPrecoSugerido({ precoCusto: undefined, margemLucro: 30, impostos: 15, custoOperacional: 10 });
    expect(preco).toBe(0);
  });
});

describe('calcularLucroLiquido', () => {
  it('calcula o lucro líquido descontando impostos e custo operacional', () => {
    // Venda 100, custo 50, impostos 10%, custoOp 5% → descontos = 15 → lucro = 100 - 50 - 15 = 35
    const lucro = calcularLucroLiquido({ precoCusto: 50, precoVenda: 100, impostos: 10, custoOperacional: 5 });
    expect(lucro).toBeCloseTo(35, 2);
  });

  it('retorna 0 quando custo igual ao preço de venda', () => {
    const lucro = calcularLucroLiquido({ precoCusto: 100, precoVenda: 100, impostos: 0, custoOperacional: 0 });
    expect(lucro).toBe(0);
  });
});

describe('classificarMargem', () => {
  it('classifica margem crítica (< 10)', () => {
    const resultado = classificarMargem(5);
    expect(resultado.label).toBe('Margem crítica');
  });

  it('classifica margem baixa (10 ≤ x < 20)', () => {
    const resultado = classificarMargem(15);
    expect(resultado.label).toBe('Margem baixa');
  });

  it('classifica margem saudável (20 ≤ x < 35)', () => {
    const resultado = classificarMargem(25);
    expect(resultado.label).toBe('Margem saudável');
  });

  it('classifica margem excelente (≥ 35)', () => {
    const resultado = classificarMargem(40);
    expect(resultado.label).toBe('Margem excelente');
  });
});
