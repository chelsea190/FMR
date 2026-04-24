export const pharmacyApi = {
  getNearby: async (_params?: any) => [],
  getById: async (id: string) => ({ id, name: 'FindMeRx Pharmacy', address: 'Lagos', phone: '' }),
  getInventory: async (_id: string) => [],
};
