interface StockLevelIndicatorProps {
  quantity: number;
  unitAbbreviation: string;
  compact?: boolean; // for use in shopping list
}

function getFractionLabel(fraction: number): string {
  if (fraction <= 0) return '0';
  if (fraction <= 0.125) return '0';
  if (fraction <= 0.375) return '¼';
  if (fraction <= 0.625) return '½';
  if (fraction <= 0.875) return '¾';
  return 'completo';
}

function getFractionPercent(fraction: number): number {
  if (fraction <= 0) return 0;
  if (fraction <= 0.125) return 0;
  if (fraction <= 0.375) return 25;
  if (fraction <= 0.625) return 50;
  if (fraction <= 0.875) return 75;
  return 100;
}

function getBarColor(percent: number): string {
  if (percent === 0) return 'bg-gray-300 dark:bg-gray-600';
  if (percent <= 25) return 'bg-red-500';
  if (percent <= 50) return 'bg-amber-500';
  if (percent <= 75) return 'bg-lime-500';
  return 'bg-green-500';
}

function getLabelColor(percent: number): string {
  if (percent === 0) return 'text-gray-400 dark:text-gray-500';
  if (percent <= 25) return 'text-red-600 dark:text-red-400';
  if (percent <= 50) return 'text-amber-600 dark:text-amber-400';
  if (percent <= 75) return 'text-lime-600 dark:text-lime-400';
  return 'text-green-600 dark:text-green-400';
}

function SingleBar({ fraction, index, compact }: { fraction: number; index: number; compact?: boolean }) {
  const percent = getFractionPercent(fraction);
  const label = getFractionLabel(fraction);
  const barColor = getBarColor(percent);
  const labelColor = getLabelColor(percent);
  const height = compact ? 'h-5' : 'h-7';
  const barHeight = compact ? 'h-5' : 'h-7';

  return (
    <div className="flex items-center gap-1.5">
      {!compact && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 w-3 text-center shrink-0">
          {index + 1}
        </span>
      )}
      <div className={`flex-1 ${height} bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative`}>
        <div
          className={`${barHeight} rounded-md ${barColor} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-white/30 dark:border-gray-600/50" />
          <div className="w-1/4 border-r border-white/30 dark:border-gray-600/50" />
          <div className="w-1/4 border-r border-white/30 dark:border-gray-600/50" />
          <div className="w-1/4" />
        </div>
      </div>
      <span className={`text-xs font-bold ${labelColor} w-14 text-right shrink-0`}>
        {label}
      </span>
    </div>
  );
}

export default function StockLevelIndicator({ quantity, unitAbbreviation, compact }: StockLevelIndicatorProps) {
  const fullUnits = Math.floor(quantity);
  const remainder = quantity - fullUnits;

  // Build array of bars: full units + remainder
  const bars: number[] = [];
  for (let i = 0; i < fullUnits && i < 5; i++) {
    bars.push(1); // full bar
  }
  if (remainder > 0 && bars.length < 5) {
    bars.push(remainder); // partial bar
  }
  // If nothing, show one empty bar
  if (bars.length === 0) {
    bars.push(0);
  }

  const showOverflow = fullUnits > 5;
  const totalLabel = quantity % 1 === 0
    ? `${quantity}`
    : `${fullUnits > 0 ? fullUnits : ''}${remainder > 0 ? getFractionLabel(remainder) !== '0' ? (fullUnits > 0 ? ' + ' : '') + getFractionLabel(remainder) : '' : ''}`;

  return (
    <div className={compact ? 'w-full' : 'w-full max-w-[200px]'}>
      {/* Total display */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {quantity} {unitAbbreviation}
        </span>
        {showOverflow && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            (+{fullUnits - 5} mas)
          </span>
        )}
      </div>

      {/* Bars */}
      <div className={`flex flex-col ${bars.length > 1 ? 'gap-1' : ''}`}>
        {bars.map((fraction, i) => (
          <SingleBar
            key={i}
            fraction={fraction}
            index={i}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
