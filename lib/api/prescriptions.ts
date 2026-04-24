export const prescriptionsApi = {
  getAll: async (_params?: any) => ({ data: [], items: [], total: 0 }),
  upload: async (..._args: any[]) => ({ ok: true }),
  delete: async (_id: string) => ({ ok: true }),
};
