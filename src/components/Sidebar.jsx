import { LayoutDashboard, Package, ArrowUpCircle, ArrowDownCircle, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
    
      {/* Menu Principal */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} text="Visão Geral" active />
        <NavItem icon={<Package size={20} />} text="Produtos" />
        <NavItem icon={<ArrowUpCircle size={20} />} text="Entradas" />
        <NavItem icon={<ArrowDownCircle size={20} />} text="Saídas" />
      </nav>

      {/* Footer do Menu */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <NavItem icon={<Settings size={20} />} text="Configurações" />
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}

// Componente auxiliar para os itens do menu ficarem padronizados
function NavItem({ icon, text, active = false }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {text}
    </a>
  );
}