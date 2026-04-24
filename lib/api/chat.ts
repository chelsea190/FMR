export const chatApi = {
  getConversations: async () => [],
  getMessages: async (_conversationId: string) => ({ data: [], items: [] }),
  markAsRead: async (_conversationId: string) => ({ ok: true }),
  sendMessage: async (conversationId: string, message: string) => ({ id: String(Date.now()), conversationId, message, createdAt: new Date().toISOString() }),
};
