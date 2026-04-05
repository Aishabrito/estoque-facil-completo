import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ArrowDownCircle, Calendar, PackageOpen, Loader2, Search, TrendingDown } from 'lucide-react';
import api from '../services/api';

export default function Saidas() {
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function carregarSaidas() {
      try {
        const response = await api.get('/movimentacoes');
        const apenasSaidas = response.data.filter(mov =>
          mov.tipo && mov.tipo.toUpperCase() === 'SAIDA'
        );
        setSaidas(apenasSaidas);
      } catch (error) {
        console.error("Erro ao carregar saídas:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarSaidas();
  }, []);

  const totalItens = saidas.reduce((acc, item) => acc + item.qtd, 0);

  const filtradas = saidas.filter(item =>
    item.produto?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowDownCircle className="text-red-600" />
            Histórico de Saídas
          </h1>
          <p className="text-sm text-gray-500 mt-1">Todas as saídas registradas no estoque</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <TrendingDown size={22} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Registros</p>
              <p className="text-2xl font-black text-gray-900">{saidas.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <ArrowDownCircle size={22} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unidades Saída</p>
              <p className="text-2xl font-black text-gray-900">{totalItens} <span className="text-sm font-medium text-gray-400">un.</span></p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar size={22} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Última Saída</p>
              <p className="text-lg font-black text-gray-900">
                {saidas[0] ? new Date(saidas[0].data).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por produto ou motivo..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                <tr>
                  <th className="p-5">Produto</th>
                  <th className="p-5">Quantidade</th>
                  <th className="p-5">Motivo / Destino</th>
                  <th className="p-5">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-16 text-center">
                      <Loader2 className="animate-spin mx-auto text-red-500" size={28} />
                    </td>
                  </tr>
                ) : filtradas.length > 0 ? (
                  filtradas.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                      <td className="p-5 font-bold text-gray-900">
                        {item.produto?.nome || <span className="text-gray-400 italic font-normal">Produto Excluído</span>}
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1 text-red-700 font-black bg-red-50 border border-red-100 px-3 py-1 rounded-full text-sm">
                          -{item.qtd} un.
                        </span>
                      </td>
                      <td className="p-5 text-gray-500 text-sm">{item.motivo || <span className="italic text-gray-300">—</span>}</td>
                      <td className="p-5 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-300" />
                          {new Date(item.data).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <PackageOpen size={40} strokeWidth={1.5} />
                        <p className="font-medium italic text-sm">Nenhuma saída encontrada.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}