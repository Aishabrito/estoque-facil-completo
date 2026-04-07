import {
  X, ArrowUpCircle, ArrowDownCircle, Loader2, Package,
  Hash, MessageSquare, ShoppingCart, Search, Plus, Minus,
  Trash2, CheckCircle, CreditCard, Banknote, QrCode
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const FORMAS_PAGAMENTO = [
  { value: 'dinheiro', label: 'Dinheiro', icon: Banknote },
  { value: 'cartao',   label: 'Cartão',   icon: CreditCard },
  { value: 'pix',      label: 'Pix',      icon: QrCode },
];

export default function RegistrarMovimentacao({ isOpen, onClose }) {
  const [aba, setAba] = useState('movimentacao'); // 'movimentacao' | 'venda'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Movimentar Estoque</h2>
            <p className="text-xs text-gray-500 mt-0.5">Registre entradas, saídas ou vendas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-2 p-3 bg-gray-100/60 shrink-0">
          <button
            onClick={() => setAba('movimentacao')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
              ${aba === 'movimentacao' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ArrowUpCircle size={18} /> Movimentação Simples
          </button>
          <button
            onClick={() => setAba('venda')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
              ${aba === 'venda' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ShoppingCart size={18} /> PDV — Venda de Balcão
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">
          {aba === 'movimentacao'
            ? <AbaMovimentacao onClose={onClose} />
            : <AbaVenda onClose={onClose} />
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ABA 1 — Movimentação Simples
───────────────────────────────────────── */
function AbaMovimentacao({ onClose }) {
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

      {/* Toggle Entrada / Saída */}
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

      {/* Produto */}
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

      {/* Quantidade */}
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

      {/* Observação */}
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

/* ─────────────────────────────────────────
   ABA 2 — PDV (Venda de Balcão)
───────────────────────────────────────── */
function AbaVenda({ onClose }) {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState('');

  const carregarProdutos = useCallback(async () => {
    try {
      const res = await api.get('/produtos');
      setProdutos(res.data);
    } catch {
      setError('Não foi possível carregar os produtos.');
    }
  }, []);

  useEffect(() => { carregarProdutos(); }, [carregarProdutos]);

  const produtosFiltrados = produtos.filter(p =>
    p.estoque > 0 &&
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const adicionarAoCarrinho = (produto) => {
    setCarrinho(prev => {
      const existe = prev.find(i => i.produtoId === produto.id);
      if (existe) {
        if (existe.quantidade >= produto.estoque) return prev;
        return prev.map(i =>
          i.produtoId === produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, {
        produtoId: produto.id,
        nome: produto.nome,
        precoNoMomento: Number(produto.preco),
        estoqueDisponivel: produto.estoque,
        quantidade: 1,
      }];
    });
  };

  const alterarQuantidade = (produtoId, delta) => {
    setCarrinho(prev => prev.map(i =>
      i.produtoId === produtoId
        ? { ...i, quantidade: Math.min(Math.max(1, i.quantidade + delta), i.estoqueDisponivel) }
        : i
    ));
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(prev => prev.filter(i => i.produtoId !== produtoId));
  };

  const fmt = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const subtotal = (item) => item.precoNoMomento * item.quantidade;
  const totalGeral = carrinho.reduce((acc, item) => acc + subtotal(item), 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const finalizarVenda = async () => {
    if (carrinho.length === 0) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/vendas', {
        itens: carrinho.map(i => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          precoNoMomento: i.precoNoMomento,
        })),
        formaPagamento,
      });
      setSucesso(true);
      window.dispatchEvent(new Event('movimentacao-registrada'));
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao finalizar venda.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-emerald-600 h-full">
        <CheckCircle size={56} strokeWidth={1.5} />
        <p className="text-xl font-bold text-gray-800">Venda finalizada!</p>
        <p className="text-sm text-gray-400">Estoque atualizado automaticamente.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">

      {/* Esquerda — busca */}
      <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar produto..."
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map(produto => (
              <button
                key={produto.id}
                type="button"
                onClick={() => adicionarAoCarrinho(produto)}
                className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/40 transition-colors text-left"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{produto.nome}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">
                    {produto.categoria} • {produto.estoque} em estoque
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-black text-emerald-600 text-sm">{fmt(produto.preco)}</p>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 mt-1">
                    <Plus size={10} /> add
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm italic">
              {busca ? 'Nenhum produto encontrado.' : 'Nenhum produto disponível.'}
            </div>
          )}
        </div>
      </div>

      {/* Direita — carrinho */}
      <div className="md:w-1/2 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {carrinho.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-300 p-8">
              <ShoppingCart size={40} strokeWidth={1} />
              <p className="text-sm italic text-gray-400">Carrinho vazio — adicione produtos</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {carrinho.map(item => (
                <div key={item.produtoId} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{item.nome}</p>
                    <button
                      onClick={() => removerDoCarrinho(item.produtoId)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, -1)}
                        className="h-7 w-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-black text-gray-800 w-8 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, 1)}
                        disabled={item.quantidade >= item.estoqueDisponivel}
                        className="h-7 w-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="text-[10px] text-gray-400">× {fmt(item.precoNoMomento)}</span>
                    </div>
                    <span className="font-black text-gray-900 text-sm">{fmt(subtotal(item))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé carrinho */}
        {carrinho.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-4 shrink-0">

            {/* Resumo */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Itens</span>
                <span className="font-bold">{totalItens} un. ({carrinho.length} produto{carrinho.length > 1 ? 's' : ''})</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-1 border-t border-gray-200">
                <span>Total</span>
                <span className="text-emerald-600">{fmt(totalGeral)}</span>
              </div>
            </div>

            {/* Forma de pagamento */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Forma de Pagamento</p>
              <div className="grid grid-cols-3 gap-2">
                {FORMAS_PAGAMENTO.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormaPagamento(value)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all
                      ${formaPagamento === value
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              onClick={finalizarVenda}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading
                ? <Loader2 className="animate-spin" size={20} />
                : <><CheckCircle size={18} /> Finalizar Venda · {fmt(totalGeral)}</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}