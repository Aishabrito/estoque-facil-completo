import { createContext, useState, useContext, useEffect } from 'react';

const StockContext = createContext();

export function StockProvider({ children }) {
  // 1. CARREGAR DADOS SALVOS (OU USAR O PADRÃO)
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('estoque-produtos');
    return savedProducts ? JSON.parse(savedProducts) : [
      { id: 1, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 149.90, stock: 32, status: 'Em Estoque' },
      { id: 2, name: 'Cadeira Gamer', category: 'Móveis', price: 899.00, stock: 5, status: 'Baixo Estoque' },
      { id: 3, name: 'Teclado Mecânico', category: 'Periféricos', price: 250.00, stock: 0, status: 'Sem Estoque' },
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('estoque-transacoes');
    return savedTransactions ? JSON.parse(savedTransactions) : [
      { id: 101, productId: 1, productName: 'Fone Bluetooth', type: 'entrada', quantity: 50, reason: 'Compra Inicial', date: '20/12/2025' },
      { id: 102, productId: 2, productName: 'Cadeira Gamer', type: 'saida', quantity: 1, reason: 'Venda #1055', date: '24/12/2025' },
      { id: 103, productId: 1, productName: 'Fone Bluetooth', type: 'saida', quantity: 2, reason: 'Venda Balcão', date: '25/12/2025' },
    ];
  });

  // 2. SALVAR AUTOMATICAMENTE SEMPRE QUE MUDAR
  useEffect(() => {
    localStorage.setItem('estoque-produtos', JSON.stringify(products));
    localStorage.setItem('estoque-transacoes', JSON.stringify(transactions));
  }, [products, transactions]);

  // Função Auxiliar para calcular Status
  const getStatus = (qtd) => {
    if (qtd <= 0) return 'Sem Estoque';
    if (qtd < 10) return 'Baixo Estoque';
    return 'Em Estoque';
  };

  // --- AÇÕES ---

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      // FIX CRÍTICO: Forçamos a conversão para Number para evitar erros de soma
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      status: getStatus(Number(newProduct.stock))
    };
    setProducts([...products, productWithId]);
  };

  const removeProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
  };

  const addTransaction = (productId, type, quantity, reason) => {
    const qtdNumber = Number(quantity); // Garante que é número

    // 1. Atualiza o Estoque do Produto
    const updatedProducts = products.map(product => {
      if (product.id === Number(productId)) {
        const currentStock = Number(product.stock);
        const newStock = type === 'entrada' 
          ? currentStock + qtdNumber 
          : currentStock - qtdNumber;
        
        return {
          ...product,
          stock: newStock,
          status: getStatus(newStock)
        };
      }
      return product;
    });

    setProducts(updatedProducts);

    // 2. Adiciona ao Histórico
    const productMoved = products.find(p => p.id === Number(productId));
    
    const newTransaction = {
      id: Date.now(),
      productId,
      productName: productMoved?.name,
      type,
      quantity: qtdNumber,
      reason,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setTransactions([newTransaction, ...transactions]);
  };

  // Função extra: Limpar tudo (útil para testes)
  const clearAllData = () => {
    if(window.confirm("Isso apagará todos os dados e resetará o sistema. Continuar?")) {
        localStorage.removeItem('estoque-produtos');
        localStorage.removeItem('estoque-transacoes');
        window.location.reload();
    }
  };

  return (
    <StockContext.Provider value={{ products, transactions, addProduct, removeProduct, addTransaction, clearAllData }}>
      {children}
    </StockContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStock() {
  return useContext(StockContext);
}