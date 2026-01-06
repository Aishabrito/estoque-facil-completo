import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ArrowDownCircle, Calendar, PackageOpen, Loader2 } from 'lucide-react';
import api from '../services/api'; 

export default function Saidas() {
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSaidas() {
      try {
        const response = await api.get('/movimentacoes');

        // Filtra apenas o que é SAIDA
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

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ArrowDownCircle className="text-red-600" />
          Histórico de Saídas
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Quantidade</th>
                  <th className="p-4">Motivo / Destino</th>
                  <th className="p-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400"><Loader2 className="animate-spin mx-auto"/></td></tr>
                ) : saidas.length > 0 ? (
                  saidas.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">
                        {item.produto?.nome || <span className="text-gray-400 italic">Produto Excluído</span>}
                      </td>
                      <td className="p-4 text-red-600 font-bold">-{item.qtd}</td>
                      <td className="p-4 text-gray-500">
                         {/* AQUI ESTÁ A CORREÇÃO: Lê o campo 'motivo' do banco */}
                        {item.motivo || '-'}
                      </td>
                      <td className="p-4 text-gray-500 flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <PackageOpen size={40} strokeWidth={1.5} />
                        <p>Nenhuma saída encontrada.</p>
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