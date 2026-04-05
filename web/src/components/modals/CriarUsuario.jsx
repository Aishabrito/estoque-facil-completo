import { X, User, Mail, Lock, Shield, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/api';

export default function CriarUsuario({ isOpen, onClose, onSave }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🚀 Rota exclusiva para Admins no seu Backend
      await api.post('/usuarios', { nome, email, senha });
      
      alert("Novo membro adicionado à equipe!");
      setNome(''); setEmail(''); setSenha('');
      onSave(); // Recarrega a lista na página de Usuários
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <UserPlus size={22} className="text-blue-600" /> Novo Membro
            </h2>
            <p className="text-xs text-gray-500 font-medium">Cadastre um novo operador para o sistema</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
              <span className="h-2 w-2 bg-red-600 rounded-full animate-ping" /> {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input required type="text" 
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700 transition-all"
                  placeholder="Ex: João Silva" value={nome} onChange={e => setNome(e.target.value)}
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">E-mail Profissional</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input required type="email" 
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700 transition-all"
                  placeholder="joao@empresa.com" value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input required type="password" 
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700 transition-all"
                  placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}