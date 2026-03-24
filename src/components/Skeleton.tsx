export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} style={style} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <div className="flex items-end gap-2 h-64">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-md"
              style={{ height: `${30 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShoppingListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InventorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-5 w-36 mb-2" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-full max-w-[200px] rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="flex gap-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <Skeleton className="h-12 w-full" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <Skeleton className="h-5 w-32 flex-1" />
          <Skeleton className="h-5 w-20 mx-4" />
          <Skeleton className="h-5 w-16 mx-4" />
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <Skeleton className="h-5 w-40 mb-2" />
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="flex items-end gap-3 h-72">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${20 + Math.random() * 80}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function StoreSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
