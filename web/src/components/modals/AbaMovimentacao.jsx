import { ArrowUpCircle, ArrowDownCircle, Loader2, Package, Hash, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AbaMovimentacao({ onClose }) {
  const [products, setProducts] = useState([]);
  const [type, setType] = useState('entrada');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/produtos')
      .then(res => setProducts(res.data))
      .catch(() => setError('Não foi possível carregar os produtos.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/movimentacoes', {
        produtoId: productId,
        tipo: type,
        qtd: Number(quantity),
        motivo: reason,
      });
      window.dispatchEvent(new Event('movimentacao-registrada'));
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar movimentação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto h-full">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <span className="h-2 w-2 bg-red-500 rounded-full" /> {error}
        </div>
      )}

      <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-xl">
        <button
          type="button"
          onClick={() => setType('entrada')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all
            ${type === 'entrada' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ArrowUpCircle size={18} /> Entrada
        </button>
        <button
          type="button"
          onClick={() => setType('saida')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all
            ${type === 'saida' ? 'bg-white text-red-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ArrowDownCircle size={18} /> Saída
        </button>
      </div>

      <div>
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">Produto</label>
        <div className="relative">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            required
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/30 font-medium text-gray-700 appearance-none cursor-pointer"
            value={productId}
            onChange={e => setProductId(e.target.value)}
          >
            <option value="">Selecione o item...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.nome} (Qtd: {p.estoque})</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">Quantidade</label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="number" min="1" required
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/30 font-bold"
            placeholder="0"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">
          Observação <span className="font-normal normal-case text-gray-300">(opcional)</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
          <textarea
            rows="2"
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/30 text-sm resize-none"
            placeholder="Ex: Reposição de estoque"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50
          ${type === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : `Confirmar ${type}`}
      </button>
    </form>
  );
}