import Sidebar from '../components/Sidebar';
import { ArrowUpCircle, Calendar } from 'lucide-react';

export default function Entradas() {
  // Dados falsos para visualização
  const history = [
    { id: 1, product: 'Fone Bluetooth', quantity: 10, date: '24/12/2025', supplier: 'Fornecedor A' },
    { id: 2, product: 'Monitor 24"', quantity: 5, date: '23/12/2025', supplier: 'Fornecedor B' },
    { id: 3, product: 'Mousepad Grande', quantity: 50, date: '20/12/2025', supplier: 'Importadora X' },
  ];

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
                <th className="p-4">Fornecedor</th>
                <th className="p-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{item.product}</td>
                  <td className="p-4 text-green-600 font-bold">+{item.quantity}</td>
                  <td className="p-4 text-gray-500">{item.supplier}</td>
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