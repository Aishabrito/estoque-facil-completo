import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const StockContext = createContext();

export function StockProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCAR DADOS DA API ---
  const refreshData = async () => {
    try {
      setLoading(true);
      // Busca produtos e movimentações em paralelo
      const [prodRes, transRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/movimentacoes')
      ]);
      
      setProducts(prodRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error("Erro ao sincronizar com o banco:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados assim que o App abre
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshData();
    }
  }, []);

  // --- AÇÕES (Agora apenas disparam o refresh ou atualizam o cache) ---

  const updateList = () => {
    refreshData(); // Função simples para as páginas forçarem uma atualização
  };

  const clearAllData = () => {
    if(window.confirm("Isso apenas limpa sua sessão local. Os dados no banco de dados do Supabase continuarão salvos. Deseja sair?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/';
    }
  };

  return (
    <StockContext.Provider value={{ 
      products, 
      transactions, 
      loading,
      updateList, // Para as páginas avisarem que algo mudou
      refreshData,
      clearAllData 
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}