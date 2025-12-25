import { LayoutDashboard, Package, ArrowUpCircle, ArrowDownCircle, Settings, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import RegistrarMovimentacao from './modals/RegistrarMovimentacao';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      {/* Botão Mobile  */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-700"
      >
        <Menu size={24} />
      </button>

      {/* Fundo escuro no mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* A SIDEBAR -  */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Estoque Fácil</span>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>
          
          <button 
            onClick={() => { setIsModalOpen(true); setIsMobileOpen(false); }}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm"
          >
            <PlusCircle size={20} />
            Movimentar
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} text="Visão Geral" path="/dashboard" active={location.pathname === '/dashboard'} />
          <NavItem icon={<Package size={20} />} text="Produtos" path="/produtos" active={location.pathname === '/produtos'} />
          <NavItem icon={<ArrowUpCircle size={20} />} text="Entradas" path="/entradas" active={location.pathname === '/entradas'} />
          <NavItem icon={<ArrowDownCircle size={20} />} text="Saídas" path="/saidas" active={location.pathname === '/saidas'} />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link to="/configuracoes" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings size={20} />
              Configurações
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <RegistrarMovimentacao isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function NavItem({ icon, text, path, active }) {
  return (
    <Link to={path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
      {icon}
      {text}
    </Link>
  );
}