import { axiosInstance } from './axiosinstance';

// Start or get a chat for a product
export const StartChat = async (productId) => {
    try {
        const response = await axiosInstance.post('/api/chats/start-chat', { productId });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// Send a message
export const SendMessage = async (chatId, text) => {
    try {
        const response = await axiosInstance.post('/api/chats/send-message', { chatId, text });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// Get all my chats
export const GetMyChats = async () => {
    try {
        const response = await axiosInstance.get('/api/chats/get-my-chats');
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// Get a single chat with messages
export const GetChatById = async (chatId) => {
    try {
        const response = await axiosInstance.get(`/api/chats/get-chat/${chatId}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// Get unread message count
export const GetUnreadCount = async () => {
    try {
        const response = await axiosInstance.get('/api/chats/unread-count');
        return response.data;
    } catch (error) {
        return error.message;
    }
};
