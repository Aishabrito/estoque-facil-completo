import { X, Save } from 'lucide-react';
import { useState } from 'react';

export default function CriarNovoProduto({ isOpen, onClose, onSave, productToEdit }) {
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState(productToEdit?.category || '');
  const [price, setPrice] = useState(productToEdit?.price || '');
  const [stock, setStock] = useState(productToEdit?.stock || '');

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, category, price, stock });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        
        {/* Cabeçalho do Modal */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            {productToEdit ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input 
              required
              type="text" 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Fone Bluetooth"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Móveis">Móveis</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input 
                required
                type="number" 
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0,00"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
              <input 
                required
                type="number" 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
          >
            <Save size={20} />
            {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}