import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, TrendingDown, AlertTriangle, Package, DollarSign, Activity, Loader2 } from 'lucide-react';
import api from '../services/api'; 
// 📊 Importando componentes do gráfico
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

  // 🧠 Lógica para organizar os dados do gráfico (últimas movimentações)
  const chartData = useMemo(() => {
    const ultimas = data.movimentacoes || [];
    const agrupado = {};

    // Agrupa entradas e saídas por data (últimos 7 registros únicos de data)
    ultimas.slice(0, 15).forEach(mov => {
      const dataFormatada = new Date(mov.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (!agrupado[dataFormatada]) {
        agrupado[dataFormatada] = { name: dataFormatada, entradas: 0, saidas: 0 };
      }
      if (mov.tipo?.toUpperCase() === 'ENTRADA') agrupado[dataFormatada].entradas += mov.qtd;
      else agrupado[dataFormatada].saidas += mov.qtd;
    });

    return Object.values(agrupado).reverse(); // Inverte para a data mais recente ficar na direita
  }, [data.movimentacoes]);

  const isEntrada = (tipo) => tipo?.toUpperCase() === 'ENTRADA';

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          {loading && <Loader2 className="animate-spin text-emerald-600" size={20} />}
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            sub={`${data.totalCategorias} categorias`} 
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 📊 SEÇÃO DO GRÁFICO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" /> Fluxo de Movimentação
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 📋 ÚLTIMAS ATIVIDADES (Refatorado) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Últimas Atividades</h2>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Tempo Real</span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto">
              {data.movimentacoes.length > 0 ? (
                data.movimentacoes.slice(0, 6).map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isEntrada(item.tipo) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isEntrada(item.tipo) ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.produto?.nome || "Excluído"}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{item.tipo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold text-sm ${isEntrada(item.tipo) ? 'text-green-600' : 'text-red-600'}`}>
                        {isEntrada(item.tipo) ? '+' : '-'}{item.qtd}
                      </span>
                      <p className="text-[10px] text-gray-400">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 text-sm italic">Nenhuma atividade registrada no banco.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value, sub, icon, color, bg, alert }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative flex flex-col justify-between min-h-[140px] overflow-hidden">
      <div className="relative z-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        {sub && (
          <div className="mt-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${alert ? 'text-orange-600 bg-orange-50 border border-orange-100' : 'text-gray-400 bg-gray-50'}`}>
              {sub}
            </span>
          </div>
        )}
      </div>
      <div className={`absolute -right-2 -bottom-2 p-6 rounded-full opacity-20 ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}