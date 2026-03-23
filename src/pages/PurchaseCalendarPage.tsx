import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Calendar, ShoppingCart } from 'lucide-react';
import { getCalendar, PurchaseCalendarDay } from '../api/purchases.api';
import { formatCurrency } from '../utils/format';
import PageHeader from '../components/common/PageHeader';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_LABELS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export default function PurchaseCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<PurchaseCalendarDay | null>(null);

  const { data: calendarData, isLoading } = useQuery({
    queryKey: ['purchaseCalendar', year, month],
    queryFn: () => getCalendar(year, month),
  });

  const dayMap = useMemo(() => {
    const map = new Map<number, PurchaseCalendarDay>();
    calendarData?.forEach((d) => {
      const day = new Date(d.date).getDate();
      map.set(day, d);
    });
    return map;
  }, [calendarData]);

  const maxSpent = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return 0;
    return Math.max(...calendarData.map((d) => d.totalSpent));
  }, [calendarData]);

  // Build calendar grid
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    // Monday = 0
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // Pad to complete last row
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [year, month]);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

  const goToPrev = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };

  const goToNext = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const getIntensityClass = (spent: number): string => {
    if (maxSpent === 0) return 'bg-blue-200 dark:bg-blue-800';
    const ratio = spent / maxSpent;
    if (ratio > 0.75) return 'bg-blue-600 dark:bg-blue-500';
    if (ratio > 0.5) return 'bg-blue-500 dark:bg-blue-600';
    if (ratio > 0.25) return 'bg-blue-400 dark:bg-blue-700';
    return 'bg-blue-300 dark:bg-blue-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Calendario de compras"
          subtitle="Visualiza tus compras por dia"
          helpKey="calendar"
        />

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={goToPrev}
            title="Mes anterior"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {MONTH_NAMES[month - 1]} {year}
          </h2>
          <button
            type="button"
            onClick={goToNext}
            title="Mes siguiente"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          {/* Header row */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {DAY_LABELS.map((label) => (
              <div key={label} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {label}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div>
              {calendarGrid.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                  {row.map((day, colIdx) => {
                    const dayData = day ? dayMap.get(day) : undefined;
                    const todayHighlight = day && isToday(day);
                    const isSelected = selectedDay && day && new Date(selectedDay.date).getDate() === day;

                    return (
                      <button
                        type="button"
                        key={colIdx}
                        disabled={!day}
                        onClick={() => {
                          if (day && dayData) setSelectedDay(dayData);
                          else if (day) setSelectedDay(null);
                        }}
                        className={`
                          relative min-h-[70px] sm:min-h-[90px] p-1.5 sm:p-2 text-left transition-colors
                          ${!day ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer'}
                          ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                        `}
                      >
                        {day && (
                          <>
                            <span
                              className={`
                                text-sm font-medium
                                ${todayHighlight
                                  ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                                  : 'text-gray-700 dark:text-gray-300'}
                              `}
                            >
                              {day}
                            </span>
                            {dayData && (
                              <div className="mt-1">
                                <div className={`w-2.5 h-2.5 rounded-full ${getIntensityClass(dayData.totalSpent)} mb-1`} />
                                <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 block truncate">
                                  {formatCurrency(dayData.totalSpent)}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {new Date(selectedDay.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDay.purchaseCount} compra{selectedDay.purchaseCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total gastado</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(selectedDay.totalSpent)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tiendas visitadas</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedDay.storeNames.map((store) => (
                    <span
                      key={store}
                      className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-500"
                    >
                      <ShoppingCart size={12} />
                      {store}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state for no selected day */}
        {!selectedDay && !isLoading && calendarData && calendarData.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona un dia con compras para ver el detalle
            </p>
          </div>
        )}

        {!isLoading && calendarData && calendarData.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <Calendar size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No hay compras registradas en este mes</p>
          </div>
        )}
      </div>
    </div>
  );
}
