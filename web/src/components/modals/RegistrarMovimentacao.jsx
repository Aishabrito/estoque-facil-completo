import { X, ArrowUpCircle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import AbaMovimentacao from './AbaMovimentacao';
import AbaVenda from './AbaVenda';

export default function RegistrarMovimentacao({ isOpen, onClose }) {
  const [aba, setAba] = useState('movimentacao');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 flex flex-col" style={{ height: '620px' }}>

        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Movimentar Estoque</h2>
            <p className="text-xs text-gray-500 mt-0.5">Registre entradas, saídas ou vendas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 p-3 bg-gray-100/60 shrink-0">
          <button
            onClick={() => setAba('movimentacao')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
              ${aba === 'movimentacao' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ArrowUpCircle size={18} /> Movimentação Simples
          </button>
          <button
            onClick={() => setAba('venda')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
              ${aba === 'venda' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ShoppingCart size={18} /> PDV — Venda de Balcão
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {aba === 'movimentacao'
            ? <AbaMovimentacao onClose={onClose} />
            : <AbaVenda onClose={onClose} />
          }
        </div>
      </div>
    </div>
  );
}