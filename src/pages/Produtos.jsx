import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CriarNovoProduto from '../components/modals/CriarNovoProduto';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado inicial dos produtos
  const [products, setProducts] = useState([
    { id: 1, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 149.90, stock: 32, status: 'Em Estoque' },
    { id: 2, name: 'Cadeira Gamer', category: 'Móveis', price: 899.00, stock: 5, status: 'Baixo Estoque' },
    { id: 3, name: 'Teclado Mecânico', category: 'Periféricos', price: 250.00, stock: 0, status: 'Sem Estoque' },
  ]);

  // Função para adicionar novo produto na lista
  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: products.length + 1,
      status: newProduct.stock > 0 ? 'Em Estoque' : 'Sem Estoque'
    };
    
    setProducts([...products, productWithId]);
    setIsModalOpen(false); // Fecha o modal após salvar
  };

  return (
    <div className="flex min-h-screen bg-background-light font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-500">Gerencie seu inventário completo</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produto..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 text-gray-500">{product.category}</td>
                  <td className="p-4 font-medium text-gray-900">
                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-4 text-gray-600">{product.stock} un.</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${product.stock === 0 ? 'bg-red-100 text-red-800' : 
                        product.stock < 10 ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Componente Modal */}
      <CriarNovoProduto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddProduct}
      />

    </div>
  );
}