import Sidebar from '../components/Sidebar';
import { Save, Settings, Trash2, Database, AlertTriangle, User } from 'lucide-react';
import { useStock } from '../contexts/StockContext';

export default function Configuracoes() {
  const { clearAllData } = useStock();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      
      {/* ESTRUTURA RESPONSIVA PADRÃO 
          - md:ml-64: Margem esquerda só no Desktop
          - w-full: Ocupa toda a largura
          - p-4: Padding menor no mobile
          - pt-20: Espaço para o menu no mobile
      */}
      <main className="w-full md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all">
        
        {/* Título com ícone mobile */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-200 text-gray-700 rounded-lg md:hidden">
            <Settings size={20} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Configurações</h1>
        </div>

        {/* --- SEÇÃO 1: PERFIL DO USUÁRIO --- */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <User size={20} />
             </div>
             <h2 className="text-lg font-bold text-gray-800">Perfil da Empresa</h2>
          </div>

          <div className="p-4 md:p-6">
            <form className="space-y-4">
              {/* Nome da Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input 
                  type="text" 
                  defaultValue="Minha Loja Tech" 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                />
              </div>
              
              {/* Grid Responsivo: 1 coluna no mobile, 2 no PC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                  <input 
                    type="text" 
                    defaultValue="Admin" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input 
                    type="email" 
                    defaultValue="admin@estoque.com" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
              </div>

              {/* Botão Responsivo: w-full no mobile */}
              <button 
                type="button" 
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors mt-4 font-medium active:scale-95 shadow-sm"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>

        {/* --- SEÇÃO 2: ZONA DE PERIGO (RESET) --- */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-red-100 bg-red-50/50 flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Zona de Perigo</h2>
              <p className="text-xs md:text-sm text-gray-500">Ações irreversíveis</p>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 hidden md:block">
                <Database size={24} />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Resetar Banco de Dados Local</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Apaga todos os produtos e restaura os dados de fábrica. Use se os números estiverem incorretos.
                </p>
              </div>
            </div>

            <button 
              onClick={clearAllData}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors border border-red-200"
            >
              <Trash2 size={18} />
              Apagar Tudo e Resetar
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}