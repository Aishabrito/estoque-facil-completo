export interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
  criadoEm?: string;
}

export interface Produto {
  id: number;
  nome: string;
  categoria?: string;
  precoCusto?: number | string | null;
  preco: number | string;
  estoque: number;
  estoqueMinimo?: number | null;
}

export interface Movimentacao {
  id: number;
  tipo: string;
  qtd: number;
  motivo?: string | null;
  data: string;
  produtoId: number;
  produto?: { nome: string } | null;
  usuarioId?: number | null;
  usuario?: { id: number; nome: string; isAdmin: boolean } | null;
}

export interface ItemVenda {
  id: number;
  produtoId: number;
  produto?: { id: number; nome: string } | null;
  quantidade: number;
  precoNoMomento: number | string;
}

export interface Venda {
  id: number;
  total: number | string;
  formaPagamento: string;
  data: string;
  usuario?: { id: number; nome: string } | null;
  itens: ItemVenda[];
}

export interface DashboardData {
  totalItens: number;
  totalCategorias: number;
  valorPatrimonial: number;
  receitaPotencial: number;
  lucroEstimado: number;
  baixoEstoque: number;
  totalVendasMes: number;
  movimentacoes: Movimentacao[];
}

export interface Config {
  id: number;
  margemLucro: number | string;
  impostos: number | string;
  custoOperacional: number | string;
}

export interface CartItem {
  produtoId: number;
  nome: string;
  precoNoMomento: number;
  estoqueDisponivel: number;
  quantidade: number;
}

export type ToastType = 'success' | 'error';

export interface Toast {
  message: string;
  type: ToastType;
}
