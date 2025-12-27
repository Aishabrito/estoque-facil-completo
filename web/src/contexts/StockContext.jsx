import { createContext, useState, useContext, useEffect } from 'react';

const StockContext = createContext();

export function StockProvider({ children }) {
  // --- CARREGAR DADOS ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('estoque-produtos');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 149.90, stock: 32, status: 'Em Estoque' },
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('estoque-transacoes');
    return saved ? JSON.parse(saved) : [];
  });

  // --- SALVAR AUTOMATICAMENTE ---
  useEffect(() => {
    localStorage.setItem('estoque-produtos', JSON.stringify(products));
    localStorage.setItem('estoque-transacoes', JSON.stringify(transactions));
  }, [products, transactions]);

  // --- AUXILIAR DE STATUS ---
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
      price: Math.max(0, Number(newProduct.price)),
      stock: Math.max(0, Number(newProduct.stock)),
      status: getStatus(Number(newProduct.stock))
    };
    setProducts([...products, productWithId]);
  };

  const updateProduct = (id, updatedData) => {
    const newProducts = products.map(product => {
      if (product.id === id) {
        const validatedStock = Math.max(0, Number(updatedData.stock));
        return {
          ...product,
          ...updatedData,
          price: Math.max(0, Number(updatedData.price)),
          stock: validatedStock,
          status: getStatus(validatedStock)
        };
      }
      return product;
    });
    setProducts(newProducts);
  };

  const removeProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
  };

  const addTransaction = (productId, type, quantity, reason) => {
    const qtdNumber = Number(quantity);
    const productIndex = products.findIndex(p => p.id === Number(productId));

    if (productIndex === -1) return { success: false, message: "Produto não encontrado!" };

    const currentProduct = products[productIndex];
    
    // VALIDAÇÃO: Impede saída maior que o estoque disponível
    if (type === 'saida' && currentProduct.stock < qtdNumber) {
      return { 
        success: false, 
        message: `Estoque insuficiente! Disponível: ${currentProduct.stock} un.` 
      };
    }

    const updatedProducts = products.map(product => {
      if (product.id === Number(productId)) {
        const currentStock = Number(product.stock);
        const newStock = type === 'entrada' ? currentStock + qtdNumber : currentStock - qtdNumber;
        return { ...product, stock: newStock, status: getStatus(newStock) };
      }
      return product;
    });

    setProducts(updatedProducts);

    const newTransaction = {
      id: Date.now(),
      productId: Number(productId),
      productName: currentProduct.name,
      type,
      quantity: qtdNumber,
      reason,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setTransactions([newTransaction, ...transactions]);
    return { success: true };
  };

  const clearAllData = () => {
    if(window.confirm("Isso apagará todos os dados salvos. Continuar?")) {
        localStorage.removeItem('estoque-produtos');
        localStorage.removeItem('estoque-transacoes');
        window.location.reload();
    }
  };

  return (
    <StockContext.Provider value={{ 
      products, 
      transactions, 
      addProduct, 
      updateProduct, 
      removeProduct, 
      addTransaction, 
      clearAllData 
    }}>
      {children}
    </StockContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStock() {
  return useContext(StockContext);
}