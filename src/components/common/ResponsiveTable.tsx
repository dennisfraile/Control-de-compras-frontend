import { Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  mobileCardRender?: (row: T) => React.ReactNode;
}

const alignClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
};

export default function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onEdit,
  onDelete,
  actions,
  emptyMessage = 'No hay datos para mostrar',
  mobileCardRender,
}: ResponsiveTableProps<T>) {
  const hasActions = !!(onEdit || onDelete || actions);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  const renderActionButtons = (row: T) => {
    if (actions) return actions(row);
    return (
      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Editar"
          >
            <Pencil size={18} className="text-blue-600" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${alignClass(col.align)}`}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-sm text-gray-700 dark:text-gray-300 ${alignClass(col.align)}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center justify-center gap-1">
                      {renderActionButtons(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map((row) => {
          if (mobileCardRender) {
            return (
              <div key={keyExtractor(row)}>
                {mobileCardRender(row)}
              </div>
            );
          }

          const visibleColumns = columns.filter((col) => !col.hideOnMobile);
          const titleColumn = visibleColumns[0];
          const detailColumns = visibleColumns.slice(1);

          return (
            <div
              key={keyExtractor(row)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {titleColumn && (
                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {titleColumn.render(row)}
                    </div>
                  )}
                  {detailColumns.length > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {detailColumns.map((col, i) => (
                        <span key={col.key}>
                          {i > 0 && ' · '}
                          {col.render(row)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {hasActions && (
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {renderActionButtons(row)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
