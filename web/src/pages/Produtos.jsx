import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CriarNovoProduto from '../components/modals/CriarNovoProduto'; 
import { Search, Plus, Edit, Trash2, Filter, PackageX, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Produtos() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      alert("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (dadosDoFormulario) => {
    try {
      const payload = {
        nome: dadosDoFormulario.nome, // Note: o modal envia 'nome' agora
        categoria: dadosDoFormulario.categoria,
        preco: Number(dadosDoFormulario.preco),
        estoque: Number(dadosDoFormulario.estoque)
      };

      if (editingProduct) {
        await api.put(`/produtos/${editingProduct.id}`, payload);
      } else {
        await api.post('/produtos', payload);
      }
      
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      alert("Erro ao salvar: " + (error.response?.data?.error || "Verifique os dados."));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Erro ao excluir: este produto pode estar vinculado a movimentações.");
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(product => 
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estoque Geral</h1>
            <p className="text-sm text-gray-500 font-medium">Controle total de itens e categorias</p>
          </div>
          
          <button 
            onClick={handleNewClick}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <Plus size={20} />
            Cadastrar Item
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest border border-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            <Filter size={16} /> Filtros
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
                <p className="font-medium">Sincronizando inventário...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                    <th className="p-5">Produto</th>
                    <th className="p-5">Categoria</th>
                    <th className="p-5">Preço Unitário</th>
                    <th className="p-5">Em Estoque</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Gerenciar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="p-5 font-bold text-gray-900">{product.nome}</td>
                        <td className="p-5">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            {product.categoria}
                          </span>
                        </td>
                        <td className="p-5 font-black text-gray-700 text-sm">
                          {Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-5 font-bold text-gray-600">{product.estoque} <span className="text-[10px] font-medium text-gray-400 uppercase">un.</span></td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
                            ${product.estoque === 0 ? 'bg-red-50 text-red-700 border-red-100' : 
                              product.estoque < 10 ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                              'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                            {product.estoque === 0 ? 'Sem Estoque' : product.estoque < 10 ? 'Baixo Estoque' : 'Disponível'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
                      <td colSpan="6" className="p-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-gray-300">
                          <PackageX size={48} strokeWidth={1} />
                          <p className="text-gray-400 font-medium italic text-sm">Nenhum item encontrado no estoque.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <CriarNovoProduto 
        key={editingProduct ? editingProduct.id : 'new'} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }} 
        onSave={handleSaveProduct} 
        productToEdit={editingProduct} 
      />
    </div>
  );
}