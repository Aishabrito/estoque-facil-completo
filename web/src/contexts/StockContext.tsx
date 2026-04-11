<<<<<<< Updated upstream
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
=======
import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
>>>>>>> Stashed changes
import api from '../services/api';

<<<<<<< Updated upstream
const StockContext = createContext();

export function StockProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
=======
interface StockContextValue {
  products: Produto[];
  transactions: Movimentacao[];
  loading: boolean;
  refreshData: () => Promise<void>;
  logout: () => void;
}

const StockContext = createContext<StockContextValue | undefined>(undefined);

interface StockProviderProps {
  children: ReactNode;
}

export function StockProvider({ children }: StockProviderProps) {
  const [products, setProducts] = useState<Produto[]>([]);
  const [transactions, setTransactions] = useState<Movimentacao[]>([]);
>>>>>>> Stashed changes
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

  const clearAllData = useCallback(async () => {
    if (!window.confirm('Tem certeza? Esta ação apagará todos os dados e é irreversível.')) return;
    try {
      await api.delete('/configuracoes/resetar');
      await refreshData();
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      const msg = error?.response?.data?.error || 'Verifique se o servidor está disponível.';
      alert(`Não foi possível resetar. ${msg}`);
    }
  }, [refreshData]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <StockContext.Provider value={{ products, transactions, loading, refreshData, logout, clearAllData }}>
      {children}
    </StockContext.Provider>
  );
}

<<<<<<< Updated upstream
// eslint-disable-next-line react-refresh/only-export-components
export function useStock() {
  return useContext(StockContext);
}
=======
// Exportado separado para satisfazer o react-refresh/only-export-components
export function useStock(): StockContextValue {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}
>>>>>>> Stashed changes
