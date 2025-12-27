import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CriarNovoProduto from '../components/modals/CriarNovoProduto'; 
import { Search, Plus, Edit, Trash2, Filter, PackageX } from 'lucide-react';
import { useStock } from '../contexts/StockContext'; 

export default function Produtos() {
  const { products, addProduct, updateProduct, removeProduct } = useStock(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);



  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (dadosDoFormulario) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, dadosDoFormulario);
    } else {
      addProduct(dadosDoFormulario);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      removeProduct(id);
    }
  };

  // --- FILTRO ---
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full transition-all">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Produtos</h1>
            <p className="text-sm text-gray-500">Gerencie seu inventário completo</p>
          </div>
          
          <button 
            onClick={handleNewClick}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span className="md:hidden">Filtrar</span>
            <span className="hidden md:inline">Filtros</span>
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
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
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{product.name}</td>
                      <td className="p-4 text-gray-500">{product.category}</td>
                      <td className="p-4 font-medium text-gray-900">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4 text-gray-600">{product.stock} un.</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                          ${product.stock === 0 ? 'bg-red-100 text-red-800' : 
                            product.stock < 10 ? 'bg-orange-100 text-orange-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <PackageX size={40} strokeWidth={1.5} className="text-gray-300"/>
                         <p>Nenhum produto encontrado.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CriarNovoProduto 
        key={editingProduct ? editingProduct.id : 'new'} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} 
        productToEdit={editingProduct} 
      />
    </div>
  );
}