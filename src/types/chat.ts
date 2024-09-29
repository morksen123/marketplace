  export interface Chat {
    chatId: number;
    buyerId: number;
    firstName: string;
    lastName: string;
    distributorId: number;
    distributorName: string;
    createdAt: string;
    messages: Message[];
    lastMessage: string;
    administratorId?: string;
  }

  export interface Message {
    messageId: number;
    chatId: number;
    senderId: number;
    senderRole: string;
    text: string;
    sentAt: string;
    images: string[];
    title?: string;
  }

  export interface Announcement {
    announcementId: number;
    chatId: number;
    senderId: number;
    senderRole: string;
    text: string;
    sentAt: string;
  }

  export interface GlobalChatContextType {
    chats: Chat[];
    messages: { [chatId: number]: Message[] };
    announcements: { [chatId: number]: Announcement[] };
    selectedChat: Chat | null;
    setSelectedChat: (chat: Chat | null) => void;
    sendMessage: (message: Omit<Message, 'messageId' | 'sentAt'>) => void;
    sendAnnouncement: (announcement: Omit<Announcement, 'announcementId' | 'sentAt'>) => void;
    reconnect: () => void;
    isLoading: boolean;
    error: string | null;
    fetchChatMessages: (chatId: number) => Promise<void>;
  }