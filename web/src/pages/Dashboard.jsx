import Sidebar from '../components/Sidebar';
import { LayoutDashboard, TrendingUp, AlertTriangle, Package, DollarSign, Activity } from 'lucide-react';
import { useStock } from '../contexts/StockContext';

export default function Dashboard() {
  const { products, transactions } = useStock();

  // Cálculos
  const totalItems = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const recentActivity = transactions.slice(0, 5); 

  return (

    <div className="min-h-screen bg-gray-50 font-sans">
      
      <Sidebar />
     
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all">
        
        {/* Título */}
        <div className="flex items-center gap-3 mb-6">
          {/* Espaço vazio no mobile para o ícone do menu não ficar em cima do texto */}
          <div className="w-8 md:hidden"></div> 
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard 
            title="Valor em Estoque"
            value={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon={<DollarSign size={24} />}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <DashboardCard 
            title="Total de Produtos"
            value={`${totalItems} un.`}
            sub={`${products.length} categorias`}
            icon={<Package size={24} />}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <DashboardCard 
            title="Estoque Baixo"
            value={`${lowStockCount} itens`}
            sub={lowStockCount > 0 ? 'Requer atenção' : 'Estoque saudável'}
            icon={<AlertTriangle size={24} />}
            color="text-orange-600"
            bg="bg-orange-50"
            alert={lowStockCount > 0}
          />
        </div>

        {/* Lista de Movimentações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" />
            <h2 className="font-semibold text-gray-700">Últimas Movimentações</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {/* Esquerda */}
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className={`p-2 rounded-full shrink-0 ${item.type === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.type === 'entrada' ? <TrendingUp size={18} /> : <TrendingUp size={18} className="rotate-180" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-500 truncate">{item.reason}</p>
                    </div>
                  </div>
                  {/* Direita */}
                  <div className="text-right shrink-0 ml-2">
                    <p className={`font-bold text-sm ${item.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.type === 'entrada' ? '+' : '-'}{item.quantity}
                    </p>
                    <p className="text-xs text-gray-400 hidden md:block">{item.date}</p>
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

// Componente Card
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