import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import CriarNovoProduto from '../components/modals/CriarNovoProduto';
import { Search, Plus, Edit, Trash2, PackageX, Loader2, CheckCircle, XCircle, X } from 'lucide-react';
import api from '../services/api';

// Toast simples, sem biblioteca externa
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-semibold animate-fade-in
      ${type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

export default function Produtos() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      showToast("Não foi possível carregar os produtos.", 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (dadosDoFormulario) => {
    try {
      const payload = {
        nome: dadosDoFormulario.nome,
        categoria: dadosDoFormulario.categoria,
        preco: Number(dadosDoFormulario.preco),
        estoque: Number(dadosDoFormulario.estoque),
      };
      if (editingProduct) {
        await api.put(`/produtos/${editingProduct.id}`, payload);
        showToast("Produto atualizado com sucesso!");
      } else {
        await api.post('/produtos', payload);
        showToast("Produto cadastrado com sucesso!");
      }
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      showToast(error.response?.data?.error || "Erro ao salvar o produto.", 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/produtos/${id}`);
      showToast("Produto excluído.");
      fetchProducts();
    } catch {
      showToast("Não foi possível excluir: produto vinculado a movimentações.", 'error');
    }
  };

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estoque Geral</h1>
            <p className="text-sm text-gray-500 font-medium">Controle total de itens e categorias</p>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <Plus size={20} />
            Cadastrar Item
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou categoria..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                      <tr key={product.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="p-5 font-bold text-gray-900">{product.nome}</td>
                        <td className="p-5">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            {product.categoria}
                          </span>
                        </td>
                        <td className="p-5 font-black text-gray-700 text-sm">
                          {Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-5 font-bold text-gray-600">
                          {product.estoque} <span className="text-[10px] font-medium text-gray-400 uppercase">un.</span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
                            ${product.estoque === 0
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : product.estoque < 10
                              ? 'bg-orange-50 text-orange-700 border-orange-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                            {product.estoque === 0 ? 'Sem Estoque' : product.estoque < 10 ? 'Baixo Estoque' : 'Disponível'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
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
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
}