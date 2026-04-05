import { X, Save, Package, Tag, DollarSign, Layers, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CriarNovoProduto({ isOpen, onClose, onSave, productToEdit }) {
  // Estados locais para o formulário
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  // 🛠️ Sincronização Segura: 
  // O ESLint reclamava porque o setState rodava solto. 
  // Agora ele só roda quando o modal ABRE ou o produto MUDA.
  useEffect(() => {
    if (isOpen) {
      setName(productToEdit?.nome || '');
      setCategory(productToEdit?.categoria || '');
      setPrice(productToEdit?.preco || '');
      setStock(productToEdit?.estoque || '');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ 
        nome: name, 
        categoria: category, 
        preco: Number(price), 
        estoque: Number(stock) 
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        
        <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {productToEdit ? 'Editar Item' : 'Novo Produto'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">Informações do Inventário</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Identificação</label>
            <div className="relative group">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input required type="text" placeholder="Ex: Monitor Gamer 24'"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-medium text-gray-700 transition-all"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Categoria</label>
            <div className="relative group">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <select required 
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-medium text-gray-700 appearance-none cursor-pointer"
                value={category} onChange={e => setCategory(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Preço (R$)</label>
              <div className="relative group">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input required type="number" step="0.01"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-bold text-gray-700 transition-all"
                  value={price} onChange={e => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Qtd. Inicial</label>
              <div className="relative group">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input required disabled={!!productToEdit} type="number"
                  className={`w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none font-bold transition-all ${productToEdit ? 'bg-gray-100 text-gray-400' : 'focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 text-gray-700'}`}
                  value={stock} onChange={e => setStock(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <><Save size={18} /> {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}