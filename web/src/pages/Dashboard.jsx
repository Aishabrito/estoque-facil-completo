import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, AlertTriangle, Package, DollarSign, Activity, Loader2 } from 'lucide-react';
import api from '../services/api'; // <--- Usando nossa API

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalItens: 0,
    totalCategorias: 0,
    valorTotal: 0,
    baixoEstoque: 0,
    movimentacoes: []
  });

  // --- BUSCA DADOS DA API ---
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar />
     
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all">
        
        {/* Título */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 md:hidden"></div> 
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          {loading && <Loader2 className="animate-spin text-emerald-600" size={20} />}
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard 
            title="Valor em Estoque"
            // Formata o número vindo do Backend
            value={Number(data.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon={<DollarSign size={24} />}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <DashboardCard 
            title="Total de Produtos"
            value={`${data.totalItens} un.`} // Quantidade física total
            sub={`${data.totalCategorias} categorias`} // Quantidade de tipos de produtos
            icon={<Package size={24} />}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <DashboardCard 
            title="Estoque Baixo"
            value={`${data.baixoEstoque} itens`}
            sub={data.baixoEstoque > 0 ? 'Requer atenção' : 'Estoque saudável'}
            icon={<AlertTriangle size={24} />}
            color="text-orange-600"
            bg="bg-orange-50"
            alert={data.baixoEstoque > 0}
          />
        </div>

        {/* Lista de Movimentações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" />
            <h2 className="font-semibold text-gray-700">Últimas Movimentações</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
               <div className="p-8 text-center text-gray-400">Carregando dados...</div>
            ) : data.movimentacoes.length > 0 ? (
              data.movimentacoes.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {/* Esquerda */}
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className={`p-2 rounded-full shrink-0 ${item.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.tipo === 'ENTRADA' ? <TrendingUp size={18} /> : <TrendingUp size={18} className="rotate-180" />}
                    </div>
                    <div className="min-w-0">
                      {/* Note: item.produto?.nome é como o Prisma retorna o include */}
                      <p className="font-medium text-gray-800 truncate text-sm">{item.produto?.nome || 'Produto Excluído'}</p>
                      <p className="text-xs text-gray-500 truncate lowercase first-letter:uppercase">
                        {item.tipo} - {item.motivo || 'Movimentação via App'}
                      </p>
                    </div>
                  </div>
                  {/* Direita */}
                  <div className="text-right shrink-0 ml-2">
                    <p className={`font-bold text-sm ${item.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.tipo === 'ENTRADA' ? '+' : '-'}{item.qtd}
                    </p>
                    <p className="text-xs text-gray-400 hidden md:block">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                    </p>
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

// Seu componente Card original (não mudei nada, está ótimo)
function DashboardCard({ title, value, sub, icon, color, bg, alert }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
      <div className="relative z-10 flex flex-col w-full">
        <p className="text-sm font-medium text-gray-500 mb-1 truncate pr-10">{title}</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight break-words w-full pr-10">
          {value}
        </h3>
        {sub && (
          <div className="mt-2 w-full">
            <span className={`text-xs font-medium truncate block max-w-full ${alert ? 'text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded-full' : 'text-gray-400'}`}>
              {sub}
            </span>
          </div>
        )}
      </div>
      <div className={`absolute top-4 right-4 p-2 sm:p-3 rounded-xl ${bg} ${color}`}>
         {icon}
      </div>
    </div>
  );
}