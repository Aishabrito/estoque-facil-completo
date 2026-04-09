import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const StockContext = createContext();

export function StockProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true);
      const [prodRes, transRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/movimentacoes'),
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
      alert('Não foi possível resetar. Verifique se o servidor está disponível.');
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

// Exportado separado para satisfazer o react-refresh/only-export-components
export function useStock() {
  return useContext(StockContext);
} 