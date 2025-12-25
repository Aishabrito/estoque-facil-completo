import { LayoutDashboard, Package, ArrowUpCircle, ArrowDownCircle, Settings, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import RegistrarMovimentacao from './modals/RegistrarMovimentacao'; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800 tracking-tight">Estoque Fácil</span>
          
          {/* Botão de Ação Principal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <PlusCircle size={20} />
            Movimentar
          </button>
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            text="Visão Geral" 
            path="/dashboard"
            active={location.pathname === '/dashboard'} 
          />
          <NavItem 
            icon={<Package size={20} />} 
            text="Produtos" 
            path="/produtos" 
            active={location.pathname === '/produtos'} 
          />
          <NavItem 
            icon={<ArrowUpCircle size={20} />} 
            text="Entradas" 
            path="/entradas"
            active={location.pathname === '/entradas'}
          />
          <NavItem 
            icon={<ArrowDownCircle size={20} />} 
            text="Saídas" 
            path="/saidas"
            active={location.pathname === '/saidas'}
          />
        </nav>

        {/* Footer do Menu */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link 
            to="/configuracoes" 
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/configuracoes' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
              <Settings size={20} />
              Configurações
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <RegistrarMovimentacao 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

// Componente do item de menu
function NavItem({ icon, text, path, active = false }) {
  return (
    <Link 
      to={path} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {text}
    </Link>
  );
}