import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, AlertTriangle, Package, DollarSign, Activity, Loader2 } from 'lucide-react';
// IMPORTANTE: Verifique se o caminho do seu arquivo de api está correto abaixo
import api from '../services/api'; 

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalItens: 0,
    totalCategorias: 0,
    valorTotal: 0,
    baixoEstoque: 0,
    movimentacoes: []
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        // Busca os dados reais que o seu Controller do Backend calculou
        const response = await api.get('/dashboard');
        
        if (response.data) {
          setData({
            totalItens: response.data.totalItens ?? 0,
            totalCategorias: response.data.totalCategorias ?? 0,
            valorTotal: response.data.valorTotal ?? 0,
            baixoEstoque: response.data.baixoEstoque ?? 0,
            movimentacoes: response.data.movimentacoes || []
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const isEntrada = (tipo) => tipo?.toUpperCase() === 'ENTRADA';

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          {loading && <Loader2 className="animate-spin text-emerald-600" size={20} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard 
            title="Valor em Estoque"
            value={(Number(data.valorTotal)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon={<DollarSign size={24} />}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <DashboardCard 
            title="Total de Produtos"
            value={`${data.totalItens} un.`} 
            sub={`${data.totalCategorias} categorias cadastradas`} 
            icon={<Package size={24} />}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <DashboardCard 
            title="Estoque Baixo"
            value={`${data.baixoEstoque} itens`}
            sub={data.baixoEstoque > 0 ? 'Atenção necessária' : 'Estoque em dia'}
            icon={<AlertTriangle size={24} />}
            color="text-orange-600"
            bg="bg-orange-50"
            alert={data.baixoEstoque > 0}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" />
            <h2 className="font-semibold text-gray-700">Últimas Atividades</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {data.movimentacoes.length > 0 ? (
              data.movimentacoes.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isEntrada(item.tipo) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <TrendingUp size={18} className={!isEntrada(item.tipo) ? 'rotate-180' : ''} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.produto?.nome || "Excluído"}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.tipo?.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="text-right font-bold text-sm">
                    <span className={isEntrada(item.tipo) ? 'text-green-600' : 'text-red-600'}>
                      {isEntrada(item.tipo) ? '+' : '-'}{item.qtd}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">Nenhuma atividade recente.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value, sub, icon, color, bg, alert }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative flex flex-col justify-between min-h-[140px]">
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {sub && (
          <div className="mt-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${alert ? 'text-orange-600 bg-orange-50' : 'text-gray-400 bg-gray-50'}`}>
              {sub}
            </span>
          </div>
        )}
      </div>
      <div className={`absolute top-4 right-4 p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
    </div>
  );
}