import { apiGet, apiDelete } from "../utils/apiClient";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatConversationsResponse {
  code: number;
  status: string;
  message: string;
  body: ChatConversation[];
}

export interface ChatMessage {
  role: string;
  content: string;
}

interface ChatMessagesResponse {
  code: number;
  status: string;
  message: string;
  body: ChatMessage[];
}

export const chatAPI = {
  async getConversations(): Promise<ChatConversationsResponse> {
    try {
      const data = await apiGet<ChatConversationsResponse>('/Chat/conversations');
      return data;
    } catch (error: any) {
      console.error('❌ getConversations failed:', error.message);
      throw error;
    }
  },

  async getConversationMessages(conversationId: string): Promise<ChatMessagesResponse> {
    try {
      const data = await apiGet<ChatMessagesResponse>(`/Chat/conversations/${conversationId}/messages`);
      return data;
    } catch (error: any) {
      console.error('❌ getConversationMessages failed:', error.message);
      throw error;
    }
  },

  async deleteConversation(conversationId: string): Promise<{ code: number; status: string; message: string }> {
    try {
      const data = await apiDelete<{ code: number; status: string; message: string }>(`/Chat/conversations/${conversationId}`);
      return data;
    } catch (error: any) {
      console.error('❌ deleteConversation failed:', error.message);
      throw error;
    }
  },
};
