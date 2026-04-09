import { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Minus, Trash2, ShoppingCart,
  CheckCircle, Loader2, CreditCard, Banknote, QrCode
} from 'lucide-react';
import api from '../../services/api';

const FORMAS_PAGAMENTO = [
  { value: 'dinheiro', label: 'Dinheiro', icon: Banknote },
  { value: 'cartao',   label: 'Cartão',   icon: CreditCard },
  { value: 'pix',      label: 'Pix',      icon: QrCode },
];

const fmt = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AbaVenda({ onClose }) {
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

  useEffect(() => { 
    carregarProdutos(); 
  }, [carregarProdutos]);

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

      // ✅ MÁGICA: Avisa o Dashboard e o Histórico para se atualizarem
      window.dispatchEvent(new CustomEvent('movimentacao-registrada'));
      
      // ✅ Atualiza a lista de produtos (estoque) localmente
      carregarProdutos();

      setSucesso(true);

      // Fecha e reseta após 2 segundos
      setTimeout(() => {
        onClose();
        setSucesso(false);
        setCarrinho([]);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao finalizar venda.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-emerald-600 h-full">
        <div className="bg-emerald-50 p-6 rounded-full">
          <CheckCircle size={56} strokeWidth={1.5} />
        </div>
        <p className="text-xl font-bold text-gray-800">Venda finalizada!</p>
        <p className="text-sm text-gray-400 text-center">O estoque e os indicadores foram atualizados.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Esquerda — lista de produtos */}
      <div className="w-1/2 border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar produto disponível..."
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 bg-white">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map(produto => (
              <button
                key={produto.id}
                type="button"
                onClick={() => adicionarAoCarrinho(produto)}
                className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/40 transition-colors text-left group"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-emerald-700 transition-colors">{produto.nome}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5 tracking-wider">
                    {produto.categoria} • <span className={produto.estoque <= 5 ? 'text-orange-500' : ''}>{produto.estoque} em estoque</span>
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-black text-emerald-600 text-sm">{fmt(produto.preco)}</p>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold flex items-center justify-center gap-1 mt-1">
                    <Plus size={10} /> add
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 text-sm italic">
              {busca ? 'Nenhum produto encontrado.' : 'Nenhum produto com estoque.'}
            </div>
          )}
        </div>
      </div>

      {/* Direita — carrinho */}
      <div className="w-1/2 flex flex-col overflow-hidden bg-gray-50/30">
        <div className="flex-1 overflow-y-auto p-2">
          {carrinho.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-300 p-8">
              <ShoppingCart size={40} strokeWidth={1} />
              <p className="text-sm italic text-gray-400">Carrinho vazio</p>
            </div>
          ) : (
            <div className="space-y-2">
              {carrinho.map(item => (
                <div key={item.produtoId} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-3">
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
                      <span className="text-sm font-black text-gray-800 w-8 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, 1)}
                        disabled={item.quantidade >= item.estoqueDisponivel}
                        className="h-7 w-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="text-[10px] text-gray-400 font-bold ml-1">× {fmt(item.precoNoMomento)}</span>
                    </div>
                    <span className="font-black text-gray-900 text-sm">{fmt(subtotal(item))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé fixo */}
        <div className="border-t border-gray-100 p-4 space-y-3 shrink-0 bg-white">
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 border border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Resumo</span>
              <span className="font-bold">{totalItens} un.</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-1.5 border-t border-gray-200">
              <span>Total Geral</span>
              <span className="text-emerald-600">{fmt(totalGeral)}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Forma de Pagamento</p>
            <div className="grid grid-cols-3 gap-2">
              {FORMAS_PAGAMENTO.map(({ value, label, icon: Icon }) => ( // eslint-disable-line no-unused-vars
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormaPagamento(value)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-black uppercase transition-all
                    ${formaPagamento === value
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-semibold animate-pulse">
              {error}
            </div>
          )}

          <button
            onClick={finalizarVenda}
            disabled={loading || carrinho.length === 0}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="animate-spin" size={20} />
              : <><CheckCircle size={18} /> Finalizar Venda · {fmt(totalGeral)}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}