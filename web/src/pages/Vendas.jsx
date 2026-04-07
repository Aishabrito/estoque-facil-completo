import { useState, useEffect, useCallback } from 'react'; // Adicionei useCallback
import Sidebar from '../components/Sidebar';
import { ShoppingCart, Loader2, Receipt, Calendar, CreditCard, User, Box } from 'lucide-react';
import api from '../services/api';

export default function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transformei em useCallback para podermos usar no useEffect de forma limpa
  const carregarVendas = useCallback(async () => {
    try {
      // O loading só aparece na primeira vez para não ficar piscando a tela depois
      const response = await api.get('/vendas');
      setVendas(response.data);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carrega ao montar a tela
    carregarVendas();

    // ⚡ O PULO DO GATO: Ouvinte de novas vendas
    window.addEventListener('movimentacao-registrada', carregarVendas);
    
    // Limpa o ouvinte quando sair da tela
    return () => {
      window.removeEventListener('movimentacao-registrada', carregarVendas);
    };
  }, [carregarVendas]);

  const fmt = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const dataFmt = (dataIso) => new Date(dataIso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full transition-all">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Histórico de Vendas</h1>
            <p className="text-sm text-gray-500 font-medium">Registro completo do caixa e cupons gerados</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-400">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
            <p>Carregando histórico do caixa...</p>
          </div>
        ) : vendas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
            <ShoppingCart size={48} className="text-gray-300 mb-4" strokeWidth={1} />
            <p className="text-gray-500 font-semibold">Nenhuma venda realizada ainda.</p>
            <p className="text-sm text-gray-400 mt-1">Use o botão central para registrar uma nova venda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vendas.map((venda) => (
              <div key={venda.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                
                {/* Cabeçalho do Recibo */}
                <div className="p-5 border-b border-gray-100 bg-emerald-50/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Cupom #{venda.id}</p>
                    <p className="text-2xl font-black text-gray-900">{fmt(venda.total)}</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-400">
                    <ShoppingCart size={20} />
                  </div>
                </div>

                {/* Info Extras */}
                <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {dataFmt(venda.data)}</div>
                  <div className="flex items-center gap-1.5 capitalize"><CreditCard size={14} /> {venda.formaPagamento}</div>
                  <div className="flex items-center gap-1.5"><User size={14} /> {venda.usuario?.nome?.split(' ')[0]}</div>
                </div>

                {/* Lista de Itens */}
                <div className="p-5 flex-1 bg-white">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Itens da Venda</p>
                  <ul className="space-y-3">
                    {venda.itens.map((item) => (
                      <li key={item.id} className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-2">
                          <Box size={14} className="text-gray-300 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                              {item.produto?.nome || 'Produto Indisponível'}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                              {item.quantidade}x de {fmt(item.precoNoMomento)}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 shrink-0">
                          {fmt(item.quantidade * item.precoNoMomento)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}