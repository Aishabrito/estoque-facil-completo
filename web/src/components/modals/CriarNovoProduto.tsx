import { X, Save, Package, Tag, DollarSign, Layers, Loader2, ShoppingCart, TrendingUp, Info } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { calcularPrecoSugerido, calcularLucroLiquido, classificarMargem } from '../../utils/precificacao';
import api from '../../services/api';
import type { Produto, Config } from '../../types';

interface CriarNovoProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: Omit<Produto, 'id'>) => Promise<void>;
  productToEdit?: Produto | null;
}

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: 'emerald' | 'blue' | 'purple';
}

function SliderInput({ label, value, onChange, color }: SliderInputProps) {
  const colors: Record<string, string> = {
    emerald: 'accent-emerald-600',
    blue: 'accent-blue-600',
    purple: 'accent-purple-600',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <span className="text-sm font-black text-gray-700">{value}%</span>
      </div>
      <input
        type="range" min="0" max="60" step="0.5"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${colors[color]}`}
      />
    </div>
  );
}

export default function CriarNovoProduto({ isOpen, onClose, onSave, productToEdit }: CriarNovoProdutoProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [preco, setPreco] = useState('');
  const [stock, setStock] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculadora
  const [margemLucro, setMargemLucro] = useState(30);
  const [impostos, setImpostos] = useState(15);
  const [custoOperacional, setCustoOperacional] = useState(10);
  const [configLoading, setConfigLoading] = useState(false);
  const [mostrarCalc, setMostrarCalc] = useState(false);

  const precoSugerido = calcularPrecoSugerido({ precoCusto, margemLucro, impostos, custoOperacional });
  const lucroLiquido = calcularLucroLiquido({ precoCusto, precoVenda: preco || precoSugerido, impostos, custoOperacional });
  const statusMargem = classificarMargem(margemLucro);
  const totalPercentual = Number(margemLucro) + Number(impostos) + Number(custoOperacional);
  const inviavel = totalPercentual >= 100;

  const carregarConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      const res = await api.get<Config>('/configuracoes');
      setMargemLucro(Number(res.data.margemLucro));
      setImpostos(Number(res.data.impostos));
      setCustoOperacional(Number(res.data.custoOperacional));
    } catch {
      // usa valores padrão se falhar
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName(productToEdit?.nome || '');
      setCategory(productToEdit?.categoria || '');
      setPrecoCusto(String(productToEdit?.precoCusto || ''));
      setPreco(String(productToEdit?.preco || ''));
      setStock(String(productToEdit?.estoque || ''));
      setEstoqueMinimo(String(productToEdit?.estoqueMinimo ?? '5'));
      setError('');
      setMostrarCalc(false);
      carregarConfig();
    }
  }, [productToEdit, isOpen, carregarConfig]);

  if (!isOpen) return null;

  const aplicarPrecoSugerido = () => {
    if (precoSugerido > 0) {
      setPreco(precoSugerido.toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave({
        nome: name,
        categoria: category,
        precoCusto: Number(precoCusto) || 0,
        preco: Number(preco),
        estoque: Number(stock),
        estoqueMinimo: Number(estoqueMinimo) || 5,
      });
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || 'Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (val: number | string) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {productToEdit ? 'Editar Item' : 'Novo Produto'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">Informações do Inventário</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="h-2 w-2 bg-red-500 rounded-full" /> {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Identificação</label>
            <div className="relative group">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input required type="text" placeholder="Ex: Monitor Gamer 24'"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-medium text-gray-700 transition-all"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Categoria</label>
            <div className="relative group">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <select required
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-medium text-gray-700 appearance-none cursor-pointer"
                value={category} onChange={e => setCategory(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Preço de Custo + Venda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Preço de Custo</label>
              <div className="relative group">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input type="number" step="0.01" min="0" placeholder="0,00"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-bold text-gray-700 transition-all"
                  value={precoCusto} onChange={e => setPrecoCusto(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Preço de Venda</label>
              <div className="relative group">
                <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input required type="number" step="0.01" min="0" placeholder="0,00"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-bold text-gray-700 transition-all"
                  value={preco} onChange={e => setPreco(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Qtd + Estoque Mínimo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Qtd. Inicial</label>
              <div className="relative group">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input required disabled={!!productToEdit} type="number" min="0"
                  className={`w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none font-bold transition-all
                    ${productToEdit ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 text-gray-700'}`}
                  value={stock} onChange={e => setStock(e.target.value)}
                />
              </div>
              {productToEdit && <p className="text-[10px] text-gray-400 mt-1 ml-1 italic">Use Movimentar para alterar</p>}
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Alerta Mínimo</label>
              <div className="relative group">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input type="number" min="0"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/30 font-bold text-gray-700 transition-all"
                  value={estoqueMinimo} onChange={e => setEstoqueMinimo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Calculadora de Precificação */}
          {precoCusto && Number(precoCusto) > 0 && (
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMostrarCalc(!mostrarCalc)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-sm font-bold text-gray-700">Calculadora de Precificação</span>
                  {!configLoading && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusMargem.bg} ${statusMargem.color}`}>
                      {statusMargem.label}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{mostrarCalc ? '▲ fechar' : '▼ abrir'}</span>
              </button>

              {mostrarCalc && (
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <SliderInput label="Margem de Lucro" value={margemLucro} onChange={setMargemLucro} color="emerald" />
                    <SliderInput label="Impostos" value={impostos} onChange={setImpostos} color="blue" />
                    <SliderInput label="Custos Operacionais" value={custoOperacional} onChange={setCustoOperacional} color="purple" />
                  </div>

                  {inviavel ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-semibold text-center">
                      ⚠ Total de {totalPercentual}% — inviável. Reduza os percentuais.
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-semibold">Preço Sugerido</span>
                        <span className="text-lg font-black text-gray-900">{fmt(precoSugerido)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-semibold">Lucro Líquido Estimado</span>
                        <span className={`text-sm font-black ${lucroLiquido >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {fmt(lucroLiquido)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Info size={10} /> Fórmula: Custo ÷ (1 − {totalPercentual}%)
                        </span>
                        <span>Total: {totalPercentual}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={aplicarPrecoSugerido}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all active:scale-95"
                      >
                        Aplicar {fmt(precoSugerido)} como Preço de Venda
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="animate-spin" size={18} />
              : <><Save size={18} /> {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
