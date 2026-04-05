import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Carrega ao iniciar
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Escuta o evento global disparado pelo modal de movimentação
  useEffect(() => {
    window.addEventListener('movimentacao-registrada', refreshData);
    return () => window.removeEventListener('movimentacao-registrada', refreshData);
  }, [refreshData]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <StockContext.Provider value={{
      products,
      transactions,
      loading,
      refreshData,
      logout,
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}