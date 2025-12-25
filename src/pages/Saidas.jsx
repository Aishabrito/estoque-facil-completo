import Sidebar from '../components/Sidebar';
import { ArrowDownCircle, Calendar } from 'lucide-react';

export default function Saidas() {
  const history = [
    { id: 1, product: 'Cadeira Gamer', quantity: 1, date: '25/12/2025', reason: 'Venda #1023' },
    { id: 2, product: 'Teclado Mecânico', quantity: 2, date: '24/12/2025', reason: 'Venda #1021' },
    { id: 3, product: 'Fone Bluetooth', quantity: 1, date: '24/12/2025', reason: 'Troca em Garantia' },
  ];

  return (
    <div className="flex min-h-screen bg-background-light font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ArrowDownCircle className="text-red-600" />
          Histórico de Saídas
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{item.product}</td>
                  <td className="p-4 text-red-600 font-bold">-{item.quantity}</td>
                  <td className="p-4 text-gray-500">{item.reason}</td>
                  <td className="p-4 text-gray-500 flex items-center gap-2">
                    <Calendar size={16} />
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}