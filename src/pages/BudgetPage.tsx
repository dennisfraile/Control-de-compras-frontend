import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { DollarSign, Save } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getBudgetStatus, updateBudget } from '../api/budgets.api';

interface BudgetStatus {
  id?: string;
  amount: number;
  spent: number;
  period: string;
  remaining: number;
  percentage: number;
}

const periodOptions = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual', label: 'Mensual' },
];

function getProgressColor(percentage: number) {
  if (percentage < 50) return { stroke: '#22c55e', bg: '#dcfce7', text: 'text-green-600 dark:text-green-400' };
  if (percentage < 80) return { stroke: '#eab308', bg: '#fef9c3', text: 'text-yellow-600 dark:text-yellow-400' };
  return { stroke: '#ef4444', bg: '#fee2e2', text: 'text-red-600 dark:text-red-400' };
}

function CircularProgress({ percentage, spent, total }: { percentage: number; spent: number; total: number }) {
  const clampedPct = Math.min(percentage, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPct / 100) * circumference;
  const colors = getProgressColor(percentage);

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" className="transform -rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="currentColor" strokeWidth="12"
          className="text-gray-200 dark:text-gray-700" />
        <circle cx="90" cy="90" r={radius} fill="none" stroke={colors.stroke} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: 180, height: 180 }}>
        <span className={`text-3xl font-bold ${colors.text}`}>{Math.round(percentage)}%</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">gastado</span>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          ${spent.toLocaleString()} <span className="text-gray-400 font-normal">/ ${total.toLocaleString()}</span>
        </p>
        <p className={`text-sm font-medium ${colors.text}`}>
          {total - spent >= 0
            ? `$${(total - spent).toLocaleString()} disponible`
            : `$${Math.abs(total - spent).toLocaleString()} excedido`}
        </p>
      </div>
    </div>
  );
}

function BudgetForm({ initialAmount, initialPeriod, onSave, saving }: {
  initialAmount?: number;
  initialPeriod?: string;
  onSave: (amount: number, period: string) => void;
  saving: boolean;
}) {
  const [amount, setAmount] = useState(initialAmount ?? 0);
  const [period, setPeriod] = useState(initialPeriod ?? 'mensual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) onSave(amount, period);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Monto del presupuesto
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Periodo
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={saving || amount <= 0}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
      >
        <Save size={16} />
        {saving ? 'Guardando...' : 'Guardar presupuesto'}
      </button>
    </form>
  );
}

export default function BudgetPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: budget, isLoading, isError } = useQuery<BudgetStatus>({
    queryKey: ['budget'],
    queryFn: getBudgetStatus,
  });

  const mutation = useMutation({
    mutationFn: (data: { amount: number; period: string }) => updateBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      enqueueSnackbar('Presupuesto actualizado', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar el presupuesto', { variant: 'error' });
    },
  });

  const handleSave = (amount: number, period: string) => {
    mutation.mutate({ amount, period });
  };

  if (isLoading) return <LoadingSpinner />;

  const hasBudget = budget && budget.amount > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Presupuesto"
          subtitle="Controla tus gastos con un presupuesto personalizado"
        />

        {!hasBudget || isError ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Sin presupuesto configurado
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configura un presupuesto para controlar tus gastos
            </p>
            <BudgetForm onSave={handleSave} saving={mutation.isPending} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                Estado actual
              </h2>
              <div className="relative flex justify-center">
                <CircularProgress
                  percentage={budget.percentage}
                  spent={budget.spent}
                  total={budget.amount}
                />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Presupuesto</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">${budget.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gastado</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">${budget.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Periodo</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">{budget.period}</p>
                </div>
              </div>
            </div>

            {/* Edit card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                Editar presupuesto
              </h2>
              <BudgetForm
                initialAmount={budget.amount}
                initialPeriod={budget.period}
                onSave={handleSave}
                saving={mutation.isPending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
