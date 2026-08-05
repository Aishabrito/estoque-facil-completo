import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import api from '../services/api';
import { Produto, Movimentacao } from '../types';

// 1. Definindo o formato do usuário logado
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

interface StockContextValue {
  products: Produto[];
  transactions: Movimentacao[];
  loading: boolean;
  user: Usuario | null;     // <-- Adicionado
  token: string | null;     // <-- Adicionado
  refreshData: () => Promise<void>;
  logout: () => void;
  clearAllData: () => Promise<void>;
}

const StockContext = createContext<StockContextValue | undefined>(undefined);

interface StockProviderProps {
  children: ReactNode;
}

export function StockProvider({ children }: StockProviderProps) {
  const [products, setProducts] = useState<Produto[]>([]);
  const [transactions, setTransactions] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Buscando o usuário e token do localStorage
  const [user] = useState<Usuario | null>(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  const [token] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const refreshData = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    try {
      setLoading(true);
      const [prodRes, transRes] = await Promise.all([
        api.get<Produto[]>('/produtos'),
        api.get<Movimentacao[]>('/movimentacoes'),
      ]);
      setProducts(prodRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error('Erro ao sincronizar com o banco:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    window.addEventListener('movimentacao-registrada', refreshData);
    return () => window.removeEventListener('movimentacao-registrada', refreshData);
  }, [refreshData]);

  const clearAllData = useCallback(async () => {
    if (!window.confirm('Tem certeza? Esta ação apagará todos os dados e é irreversível.')) return;
    try {
      await api.delete('/configuracoes/resetar');
      await refreshData();
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      const msg = axiosError?.response?.data?.error || 'Verifique se o servidor está disponível.';
      alert(`Não foi possível resetar. ${msg}`);
    }
  }, [refreshData]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    // 3. Exportando o user e o token para a aplicação inteira
    <StockContext.Provider value={{ products, transactions, loading, user, token, refreshData, logout, clearAllData }}>
      {children}
    </StockContext.Provider>
  );
}

// Exportado separado para satisfazer o react-refresh/only-export-components
export function useStock(): StockContextValue {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}