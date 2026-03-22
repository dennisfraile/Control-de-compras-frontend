import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { UnitTypeAbbreviations, UnitType } from './constants';

dayjs.locale('es');

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function formatQuantity(quantity: number, unit: UnitType): string {
  const abbreviation = UnitTypeAbbreviations[unit] ?? unit;
  return `${quantity} ${abbreviation}`;
}

export function formatRelativeDate(date: string | Date): string {
  const diff = dayjs(date).diff(dayjs(), 'day');
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff === -1) return 'Ayer';
  if (diff > 0) return `En ${diff} días`;
  return `Hace ${Math.abs(diff)} días`;
}
