export function formatCurrency(value?: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value || 0);
}
export function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}
export function formatDateTime(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
export function formatDistance(value?: number) {
  if (value === undefined || value === null) return 'Nearby';
  return `${value.toFixed(value < 10 ? 1 : 0)} km`;
}
export function getOrderStatusLabel(status?: string) {
  if (!status) return 'Pending';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
export function getOrderStatusColor(status?: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    preparing: 'bg-blue-50 text-blue-700 border-blue-200',
    ready: 'bg-teal-50 text-teal-700 border-teal-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[status || 'pending'] || map.pending;
}
