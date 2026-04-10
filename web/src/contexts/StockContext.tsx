import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import api from '../services/api';
import type { Produto, Movimentacao } from '../types';

interface StockContextValue {
  products: Produto[];
  transactions: Movimentacao[];
  loading: boolean;
  refreshData: () => Promise<void>;
  logout: () => void;
  clearAllData: () => void;
}

const StockContext = createContext<StockContextValue | undefined>(undefined);

interface StockProviderProps {
  children: ReactNode;
}

export function StockProvider({ children }: StockProviderProps) {
  const [products, setProducts] = useState<Produto[]>([]);
  const [transactions, setTransactions] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  const clearAllData = () => {
    logout();
  };

  return (
    <StockContext.Provider value={{ products, transactions, loading, refreshData, logout, clearAllData }}>
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
