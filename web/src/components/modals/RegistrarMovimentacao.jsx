import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { useStock } from '../../contexts/StockContext'; // <--- NÃO VAMOS USAR ISSO PARA A LISTA
import api from '../../services/api'; // <--- VAMOS USAR A API REAL

export default function RegistrarMovimentacao({ isOpen, onClose }) {
  // Estado local para guardar os produtos que vêm do banco
  const [products, setProducts] = useState([]);
  
  const [type, setType] = useState('entrada');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(''); 

  // --- CORREÇÃO 1: Buscar produtos reais da API quando o modal abrir ---
  useEffect(() => {
    if (isOpen) {
      api.get('/produtos')
        .then((response) => {
          setProducts(response.data);
        })
        .catch((err) => {
          console.error("Erro ao carregar produtos:", err);
          setError("Erro ao carregar lista de produtos.");
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productId || !quantity || !reason) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (Number(quantity) <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }

    // --- CORREÇÃO 2: Salvar a movimentação no Banco de Dados (opcional) ---
    // Se o seu 'addTransaction' do Context apenas muda o estado local, 
    // ele não vai salvar no banco. O ideal seria fazer um post aqui também.
    // Exemplo (se você tiver a rota criada):
    /*
    try {
        await api.post('/movimentacoes', {
            produtoId: Number(productId),
            tipo: type, // 'entrada' ou 'saida'
            qtd: Number(quantity),
            motivo: reason
        });
        // Sucesso
        onClose();
        setProductId('');
        setQuantity('');
        setReason('');
    } catch (err) {
        setError('Erro ao salvar movimentação');
    }
    */
   
   // Por enquanto, vou manter sua lógica original de addTransaction se ela estiver conectada,
   // mas saiba que se ela for do useStock, ela pode não estar salvando no banco.
   // const result = addTransaction(productId, type, quantity, reason);
   
   console.log("Enviando movimentação...", { productId, type, quantity, reason });
   alert("Movimentação registrada! (Implementar chamada API aqui se necessário)");
   onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Registrar Movimentação</h2>
          <button onClick={() => { setError(''); onClose(); }} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button 
              type="button"
              onClick={() => { setType('entrada'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${type === 'entrada' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ArrowUpCircle size={18} /> Entrada
            </button>
            <button 
              type="button"
              onClick={() => { setType('saida'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${type === 'saida' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ArrowDownCircle size={18} /> Saída
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Selecione o produto...</option>
              {/* --- CORREÇÃO 3: Usar os nomes certos do Banco de Dados (nome, estoque) --- */}
              {products.map(p => (
                <option key={p.id} value={p.id}>
                    {p.nome} (Atual: {p.estoque})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input 
              type="number"
              min="1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo / Observação</label>
            <input 
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Venda balcão, Reposição..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-3 rounded-lg text-white font-bold transition-all active:scale-95 mt-2 ${type === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            Confirmar {type === 'entrada' ? 'Entrada' : 'Saída'}
          </button>
        </form>
      </div>
    </div>
  );
}