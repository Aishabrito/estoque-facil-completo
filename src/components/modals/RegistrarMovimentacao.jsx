import { X } from 'lucide-react';
import { useState } from 'react';
import { useStock } from '../../contexts/StockContext';

export default function RegistrarMovimentacao({ isOpen, onClose }) {
  const { products, addTransaction } = useStock(); // Pega produtos e função do contexto
  
  const [type, setType] = useState('saida'); // 'entrada' ou 'saida'
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    reason: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chama a função global que atualiza tudo
    addTransaction(formData.productId, type, formData.quantity, formData.reason);
    onClose();
    setFormData({ productId: '', quantity: 1, reason: '' }); // Reseta
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Nova Movimentação</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Operação */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setType('entrada')}
              className={`flex-1 py-2 rounded-lg font-medium border ${type === 'entrada' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500'}`}
            >
              Entrada (+ Estoque)
            </button>
            <button
              type="button"
              onClick={() => setType('saida')}
              className={`flex-1 py-2 rounded-lg font-medium border ${type === 'saida' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500'}`}
            >
              Saída (Venda)
            </button>
          </div>

          {/* Selecionar Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
            >
              <option value="">Selecione o produto...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Atual: {p.stock})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input
                required
                type="number"
                min="1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <input
                required
                type="text"
                placeholder={type === 'entrada' ? 'Ex: Fornecedor A' : 'Ex: Venda no Balcão'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full py-2 mt-4 text-white bg-primary-600 rounded-lg hover:bg-primary-700">
            Confirmar {type === 'entrada' ? 'Entrada' : 'Saída'}
          </button>
        </form>
      </div>
    </div>
  );
}