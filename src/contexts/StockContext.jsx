import { createContext, useState, useContext } from 'react';

const StockContext = createContext();

export function StockProvider({ children }) {
  // 1. Estado Global de Produtos
  const [products, setProducts] = useState([
    { id: 1, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 149.90, stock: 32, status: 'Em Estoque' },
    { id: 2, name: 'Cadeira Gamer', category: 'Móveis', price: 899.00, stock: 5, status: 'Baixo Estoque' },
    { id: 3, name: 'Teclado Mecânico', category: 'Periféricos', price: 250.00, stock: 0, status: 'Sem Estoque' },
  ]);

  // 2. Estado Global de Histórico (Entradas e Saídas)
  const [transactions, setTransactions] = useState([]);

  // Função para adicionar novo produto (Do zero)
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      status: newProduct.stock > 0 ? 'Em Estoque' : 'Sem Estoque'
    };
    setProducts([...products, productWithId]);
  };

  // Função para registrar Entrada ou Saída
  const addTransaction = (productId, type, quantity, reason) => {
    // 1. Atualiza o Estoque do Produto
    const updatedProducts = products.map(product => {
      if (product.id === Number(productId)) {
        const newStock = type === 'entrada' 
          ? product.stock + Number(quantity) 
          : product.stock - Number(quantity);
        
        return {
          ...product,
          stock: newStock,
          status: newStock > 0 ? (newStock < 10 ? 'Baixo Estoque' : 'Em Estoque') : 'Sem Estoque'
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
      type, // 'entrada' ou 'saida'
      quantity: Number(quantity),
      reason, // 'Venda', 'Compra', 'Perda'
      date: new Date().toLocaleDateString('pt-BR')
    };

    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <StockContext.Provider value={{ products, transactions, addProduct, addTransaction }}>
      {children}
    </StockContext.Provider>
  );
}

// Hook personalizado para facilitar o uso
// eslint-disable-next-line react-refresh/only-export-components
export function useStock() {
  return useContext(StockContext);
}