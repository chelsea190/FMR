async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) } });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Request failed');
  return response.json();
}

export const inventoryApi = {
  getMyInventory: async () => [],
  addDrug: async (payload: any) => payload,
  updateDrug: async (id: string, payload: any) => ({ id, ...payload }),
  deleteDrug: async (_id: string) => ({ ok: true }),
};

export const drugsApi = {
  search: async (q: string) => request<any[]>(`/api/public-inventory?q=${encodeURIComponent(q)}`).catch(() => []),
};

export { ordersApi } from './orders';
