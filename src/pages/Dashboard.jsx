import Sidebar from '../components/Sidebar';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background-light font-sans">
      <Sidebar />
      {/* Conteúdo Principal (Movemos para a direita por causa da Sidebar fixa) */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Cabeçalho da Página */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
            <p className="text-gray-500">Bem-vinda de volta, Aisha Brito.</p>
          </div>
          <div className="flex items-center gap-4">
             {/* Aqui poderia entrar um avatar ou notificação no futuro */}
             <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                AB
             </div>
          </div>
        </header>

        {/* Grid de Cards (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Produtos" 
            value="1.240" 
            icon={<Package size={24} />} 
            color="bg-blue-500"
            trend="+12% esse mês"
          />
          <StatCard 
            title="Estoque Baixo" 
            value="8" 
            icon={<AlertTriangle size={24} />} 
            color="bg-orange-500"
            alert 
          />
          <StatCard 
            title="Valor em Estoque" 
            value="R$ 45.200" 
            icon={<DollarSign size={24} />} 
            color="bg-green-500"
          />
           <StatCard 
            title="Saídas Hoje" 
            value="24" 
            icon={<TrendingUp size={24} />} 
            color="bg-purple-500"
          />
        </div>

        {/* Área de Conteúdo Placeholder (Tabela recente, etc) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Movimentações Recentes</h3>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-400">
            Aqui entrará a tabela de movimentações...
          </div>
        </div>

      </main>
    </div>
  );
}

// Componente simples para os Cards
function StatCard({ title, value, icon, color, trend, alert }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg text-white ${color} shadow-sm`}>
          {icon}
        </div>
        {alert && <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {trend && <p className="text-xs font-medium text-green-600 mt-2 flex items-center"> {trend}</p>}
      </div>
    </div>
  );
}