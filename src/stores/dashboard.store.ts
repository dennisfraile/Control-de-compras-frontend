import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetId = 'stats' | 'lowStock' | 'chart' | 'quickConsume' | 'savingsGoal' | 'recentPurchases';

interface DashboardState {
  widgetOrder: WidgetId[];
  hiddenWidgets: WidgetId[];
  setWidgetOrder: (order: WidgetId[]) => void;
  toggleWidget: (id: WidgetId) => void;
  resetLayout: () => void;
}

const DEFAULT_ORDER: WidgetId[] = ['stats', 'lowStock', 'chart', 'quickConsume', 'savingsGoal', 'recentPurchases'];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgetOrder: DEFAULT_ORDER,
      hiddenWidgets: [],

      setWidgetOrder: (order) => set({ widgetOrder: order }),

      toggleWidget: (id) =>
        set((state) => ({
          hiddenWidgets: state.hiddenWidgets.includes(id)
            ? state.hiddenWidgets.filter((w) => w !== id)
            : [...state.hiddenWidgets, id],
        })),

      resetLayout: () =>
        set({ widgetOrder: DEFAULT_ORDER, hiddenWidgets: [] }),
    }),
    {
      name: 'dashboard-layout',
    },
  ),
);
