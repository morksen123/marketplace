import React, { createContext, useContext, useState, useEffect } from 'react';
import WebSocketService from '@/services/WebSocketService';
import { Chat, Message, GlobalChatContextType } from '@/types/chat';

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

export const GlobalChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [chatId: number]: Message[] }>({});
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const connectWebSocket = async () => {
      await WebSocketService.connect();
      WebSocketService.subscribe('/topic/chats', handleChatUpdate);
    };

    connectWebSocket();
    fetchChats();

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat/all');
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      } else {
        console.error('Failed to fetch chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleChatUpdate = (message: any) => {
    const updatedChat = JSON.parse(message.body);
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.chatId === updatedChat.chatId ? { ...chat, ...updatedChat } : chat
      )
    );
  };

  const fetchChatMessages = async (chatId: number) => {
    if (!messages[chatId]) {
      try {
        const response = await fetch(`/api/chat/messages/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(prevMessages => ({
            ...prevMessages,
            [chatId]: data
          }));
        } else {
          console.error('Failed to fetch chat messages');
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  };

  const sendMessage = async (message: Omit<Message, 'messageId' | 'sentAt'>) => {
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prevMessages => ({
          ...prevMessages,
          [message.chatId]: [...(prevMessages[message.chatId] || []), sentMessage]
        }));
        WebSocketService.sendMessage('/app/sendMessage', sentMessage);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <GlobalChatContext.Provider 
      value={{ 
        chats, 
        messages, 
        selectedChat, 
        setSelectedChat, 
        sendMessage, 
        fetchChatMessages 
      }}
    >
      {children}
    </GlobalChatContext.Provider>
  );
};

export const useGlobalChat = () => {
  const context = useContext(GlobalChatContext);
  if (context === undefined) {
    throw new Error('useGlobalChat must be used within a GlobalChatProvider');
  }
  return context;
};