import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CriarUsuario from '../components/modals/CriarUsuario';
import { Users, UserPlus, Loader2, Shield, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/usuarios'); 
      setUsuarios(response.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Não foi possível carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usuarioLogado.isAdmin) {
      carregarUsuarios();
    }
  }, [carregarUsuarios, usuarioLogado.isAdmin]);

  if (!usuarioLogado.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full transition-all">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" /> Equipe e Acessos
            </h1>
            <p className="text-sm text-gray-500">Gerencie quem pode operar o sistema de estoque</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <UserPlus size={20} />
            Cadastrar Novo Membro
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 animate-shake">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-24 flex flex-col items-center justify-center text-gray-400 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-semibold animate-pulse">Sincronizando com o banco...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                  <tr>
                    <th className="p-5">Membro da Equipe</th>
                    <th className="p-5">E-mail de Login</th>
                    <th className="p-5 text-center">Nível de Acesso</th>
                    <th className="p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usuarios.length > 0 ? (
                    usuarios.map((user) => (
                      <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-100">
                              {user.nome?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-tight">{user.nome}</p>
                              <p className="text-[10px] text-gray-400 font-medium">ID: {String(user.id).padStart(4, '0')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-gray-500 font-medium text-sm">
                          {user.email}
                        </td>
                        <td className="p-5">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              user.isAdmin 
                              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {user.isAdmin && <Shield size={12} />}
                              {user.isAdmin ? 'Administrador' : 'Operador'}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Ativo</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center text-gray-400 italic font-medium">
                        Nenhum usuário encontrado no banco de dados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <CriarUsuario 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={carregarUsuarios} 
      />
    </div>
  );
}