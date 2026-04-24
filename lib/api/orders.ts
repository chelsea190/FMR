export const ordersApi = {
  getAll: async (_params?: any) => ({ data: [], items: [], total: 0 }),
  getById: async (id: string) => ({ id, status: 'pending', totalAmount: 0, items: [] }),
  create: async (payload: any) => ({ id: crypto.randomUUID?.() || String(Date.now()), status: 'pending', ...payload }),
  cancel: async (id: string) => ({ id, status: 'cancelled' }),
  updateStatus: async (id: string, status: string) => ({ id, status }),
};
