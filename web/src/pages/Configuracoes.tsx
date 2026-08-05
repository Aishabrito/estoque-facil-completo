import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Save, Settings, Trash2, Database, AlertTriangle, User, UserPlus, ShieldCheck } from 'lucide-react';
import { useStock } from '../contexts/StockContext';

export default function Configuracoes() {
  // 1. Extraímos o 'user' e o 'token' (se houver) do contexto para verificar as permissões
  const { logout, user, token } = useStock();

  // 2. Estados para o novo formulário de criação de usuário
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', isAdmin: false });
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);

  const clearAllData = () => {
    if (window.confirm('Tem certeza? Esta ação não pode ser desfeita.')) {
      logout();
    }
  };

  // 3. Função para enviar os dados para a sua API
  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      // Ajuste a URL base se você utilizar uma instância do Axios configurada no projeto
      const response = await fetch('http://localhost:3002/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o token para passar no verificarAdmin
        },
        body: JSON.stringify(novoUsuario)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao criar usuário');

      setMensagem({ tipo: 'sucesso', texto: 'Membro da equipe adicionado com sucesso!' });
      setNovoUsuario({ nome: '', email: '', senha: '', isAdmin: false }); // Limpa o form

    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      <main className="w-full md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all">

        {/* Título com ícone mobile */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-200 text-gray-700 rounded-lg md:hidden">
            <Settings size={20} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Configurações</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          
          {/* LADO ESQUERDO: Perfil e Zona de Perigo */}
          <div className="space-y-8 w-full max-w-2xl">
            {/* --- SEÇÃO 1: PERFIL DO USUÁRIO --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Meu Perfil</h2>
              </div>

              <div className="p-4 md:p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                      <input
                        type="text"
                        defaultValue={user?.nome || "Admin"}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <input
                        type="email"
                        defaultValue={user?.email || "admin@estoque.com"}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* --- SEÇÃO 2: ZONA DE PERIGO (RESET) --- */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-red-100 bg-red-50/50 flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Sessão</h2>
                  <p className="text-xs md:text-sm text-gray-500">Controle de acesso do dispositivo</p>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400 hidden md:block">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Encerrar Sessão</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Realiza o logoff seguro da sua conta e limpa os dados locais do dispositivo.
                    </p>
                  </div>
                </div>

                <button
                  onClick={clearAllData}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors border border-red-200"
                >
                  <Trash2 size={18} />
                  Sair do Sistema
                </button>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Gestão de Equipe (EXCLUSIVO PARA ADMINS) */}
          {user?.isAdmin && (
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
              
              <div className="p-4 md:p-6 border-b border-emerald-50 bg-emerald-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Gestão de Equipe</h2>
                    <p className="text-xs text-gray-500">Área restrita à administração</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <form onSubmit={handleCriarUsuario} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Silva"
                      value={novoUsuario.nome}
                      onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Profissional</label>
                      <input
                        type="email"
                        required
                        placeholder="carlos@empresa.com"
                        value={novoUsuario.email}
                        onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Senha Provisória</label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        value={novoUsuario.senha}
                        onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-3 mt-2 border-t border-gray-100">
                    <input
                      type="checkbox"
                      id="adminCheckbox"
                      checked={novoUsuario.isAdmin}
                      onChange={(e) => setNovoUsuario({...novoUsuario, isAdmin: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="adminCheckbox" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Conceder privilégios de Administrador
                    </label>
                  </div>

                  {/* Feedback Visual */}
                  {mensagem.texto && (
                    <div className={`p-3 rounded-lg text-sm ${mensagem.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {mensagem.texto}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors mt-2 font-medium active:scale-95 shadow-sm disabled:opacity-70"
                  >
                    <UserPlus size={18} />
                    {loading ? 'Criando usuário...' : 'Cadastrar Membro'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}