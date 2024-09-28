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
  
  export interface BuyerChat { //wanna remove this
    chatId: number;
    distributorName: string;  
    distributorId: number;
    lastMessage: string;
    administratorId: string | null;
  }
  
  export interface DistributorChat { //wanna remove this
    chatId: number;
    firstName: string;
    lastName: string;
    buyerId: string;
    lastMessage: string;
    administratorId: string | null;
  }

  export interface GlobalChatContextType {
    chats: Chat[];
    messages: { [chatId: number]: Message[] };
    selectedChat: Chat | null;
    setSelectedChat: (chat: Chat | null) => void;
    sendMessage: (message: Omit<Message, 'messageId' | 'sentAt'>) => void;
    fetchChatMessages: (chatId: number) => Promise<void>;
  }