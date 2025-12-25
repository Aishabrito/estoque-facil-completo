import Sidebar from '../components/Sidebar';
import { Save } from 'lucide-react';

export default function Configuracoes() {
  return (
    <div className="flex min-h-screen bg-background-light font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>

        <div className="bg-white max-w-2xl rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Perfil do Usuário</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
              <input type="text" defaultValue="Minha Loja Tech" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                <input type="text" defaultValue="Admin" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" defaultValue="admin@estoque.com" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              </div>
            </div>

            <button type="button" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors mt-4">
              <Save size={18} />
              Salvar Alterações
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}