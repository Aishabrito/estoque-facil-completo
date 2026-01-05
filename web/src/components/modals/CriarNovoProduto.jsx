import { X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CriarNovoProduto({ isOpen, onClose, onSave, productToEdit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Sempre que o modal abrir ou o produto para editar mudar, atualiza os campos
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.nome);
      setCategory(productToEdit.categoria);
      setPrice(productToEdit.preco);
      setStock(productToEdit.estoque);
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStock('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, category, price, stock });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            {productToEdit ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input 
              required
              type="text" 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
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
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
              <input 
                required
                disabled={!!productToEdit} // Bloqueia edição de estoque aqui (deve ser via Entradas/Saídas)
                type="number" 
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ${productToEdit ? 'bg-gray-100' : 'focus:ring-2 focus:ring-emerald-500'}`}
                value={stock}
                onChange={e => setStock(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-95">
            <Save size={20} />
            {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}