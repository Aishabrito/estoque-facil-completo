import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import {
  TrendingUp, TrendingDown, AlertTriangle, Package,
  DollarSign, Activity, Loader2, ShoppingBag, TrendingUp as Lucro
} from 'lucide-react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalItens: 0,
    totalCategorias: 0,
    valorPatrimonial: 0,
    receitaPotencial: 0,
    lucroEstimado: 0,
    baixoEstoque: 0,
    movimentacoes: [],
  });

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const response = await api.get('/dashboard');
        if (response.data) {
          setData({
            totalItens:        response.data.totalItens        ?? 0,
            totalCategorias:   response.data.totalCategorias   ?? 0,
            valorPatrimonial:  response.data.valorPatrimonial  ?? 0,
            receitaPotencial:  response.data.receitaPotencial  ?? 0,
            lucroEstimado:     response.data.lucroEstimado     ?? 0,
            baixoEstoque:      response.data.baixoEstoque      ?? 0,
            movimentacoes:     response.data.movimentacoes     || [],
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const chartData = useMemo(() => {
    const agrupado = {};
    data.movimentacoes.forEach(mov => {
      const dia = new Date(mov.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (!agrupado[dia]) agrupado[dia] = { name: dia, entradas: 0, saidas: 0 };
      if (mov.tipo?.toUpperCase() === 'ENTRADA') agrupado[dia].entradas += mov.qtd;
      else agrupado[dia].saidas += mov.qtd;
    });
    return Object.values(agrupado).reverse();
  }, [data.movimentacoes]);

  const isEntrada = (tipo) => tipo?.toUpperCase() === 'ENTRADA';

  const fmt = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Bem-vinda, <span className="font-semibold text-gray-700">{usuario.nome?.split(' ')[0]}</span> 👋
            </p>
          </div>
          {loading && <Loader2 className="animate-spin text-emerald-600" size={20} />}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Patrimônio em Estoque"
            value={fmt(data.valorPatrimonial)}
            sub="Custo total investido"
            icon={<DollarSign size={22} />}
            color="text-blue-600" bg="bg-blue-50"
          />
          <DashboardCard
            title="Receita Potencial"
            value={fmt(data.receitaPotencial)}
            sub="Se vender tudo"
            icon={<ShoppingBag size={22} />}
            color="text-emerald-600" bg="bg-emerald-50"
          />
          <DashboardCard
            title="Margem Bruta"
            value={fmt(data.lucroEstimado)}
            sub="Receita − Custo"
            icon={<TrendingUp size={22} />}
            color="text-purple-600" bg="bg-purple-50"
          />
          <DashboardCard
            title="Alertas de Estoque"
            value={`${data.baixoEstoque} itens`}
            sub={data.baixoEstoque > 0 ? 'Reposição necessária' : 'Estoque em dia'}
            icon={<AlertTriangle size={22} />}
            color="text-orange-600" bg="bg-orange-50"
            alert={data.baixoEstoque > 0}
          />
        </div>

        {/* Segunda linha: card info + gráfico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Package size={22} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Produtos</p>
              <p className="text-2xl font-black text-gray-900">{data.totalItens} <span className="text-sm font-medium text-gray-400">un.</span></p>
              <p className="text-[11px] text-gray-400">{data.totalCategorias} categorias diferentes</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" /> Fluxo de Movimentações
            </h2>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
                  />
                  <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Últimas atividades */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 text-sm">Últimas Atividades</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
              Tempo Real
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {data.movimentacoes.length > 0 ? (
              data.movimentacoes.slice(0, 6).map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isEntrada(item.tipo) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {isEntrada(item.tipo) ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.produto?.nome || 'Produto removido'}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">{item.tipo} • {item.motivo || '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-black text-sm ${isEntrada(item.tipo) ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isEntrada(item.tipo) ? '+' : '-'}{item.qtd}
                    </span>
                    <p className="text-[10px] text-gray-400">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center text-gray-400 text-sm italic">
                Nenhuma atividade registrada ainda.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

function DashboardCard({ title, value, sub, icon, color, bg, alert }) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border overflow-hidden relative flex flex-col justify-between min-h-[120px]
      ${alert ? 'border-orange-200' : 'border-gray-100'}`}>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-xl font-black text-gray-900 leading-tight">{value}</h3>
        {sub && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block uppercase
            ${alert ? 'text-orange-600 bg-orange-50 border border-orange-100' : 'text-gray-400 bg-gray-50'}`}>
            {sub}
          </span>
        )}
      </div>
      <div className={`absolute -right-3 -bottom-3 p-5 rounded-full opacity-15 ${bg}`}>
        <span className={color}>{icon}</span>
      </div>
    </div>
  );
}