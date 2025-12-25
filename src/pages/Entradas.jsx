import Sidebar from '../components/Sidebar';
import { ArrowUpCircle, Calendar, PackageOpen } from 'lucide-react';
import { useStock } from '../contexts/StockContext'; // <--- Importante: Importar o Contexto

export default function Entradas() {
  // 1. Pegamos a lista COMPLETA de transações do cérebro (Contexto)
  const { transactions } = useStock(); 

  // 2. Filtramos: Quero apenas o que tiver type igual a 'entrada'
  // O "|| []" garante que não quebre se a lista vier vazia
  const entradas = (transactions || []).filter(t => t.type === 'entrada');

  return (
    <div className="flex min-h-screen bg-background-light font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ArrowUpCircle className="text-green-600" />
          Histórico de Entradas
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Fornecedor / Origem</th>
                <th className="p-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entradas.length > 0 ? (
                entradas.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{item.productName}</td>
                    <td className="p-4 text-green-600 font-bold">+{item.quantity}</td>
                    <td className="p-4 text-gray-500">{item.reason}</td>
                    <td className="p-4 text-gray-500 flex items-center gap-2">
                      <Calendar size={16} />
                      {item.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <PackageOpen size={40} strokeWidth={1.5} />
                      <p>Nenhuma entrada registrada no sistema.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}