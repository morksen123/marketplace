import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import WebSocketService from '@/services/WebSocketService';
import { Chat, Message, Announcement, GlobalChatContextType } from '@/types/chat';
import { toast } from '@/hooks/use-toast';
import {
  chatsAtom,
  messagesAtom,
  announcementsAtom,
  selectedChatAtom,
  isLoadingAtom,
  errorAtom,
} from '@/atoms/chatAtoms';

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

export const GlobalChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useAtom(chatsAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [announcements, setAnnouncements] = useAtom(announcementsAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const handleChatUpdate = useCallback((message: any) => {
    const updatedChat = JSON.parse(message.body);
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.chatId === updatedChat.chatId ? { ...chat, ...updatedChat } : chat
      )
    );
  }, []);

  const handleChatMessage = useCallback((message: any) => {
    const data = JSON.parse(message.body);
    console.log('Received message:', data);

    if (data.messageType === 'MESSAGE') {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [data.chatId]: [...(prevMessages[data.chatId] || []), data],
      }));

      setChats((prevChats) => 
        prevChats.map((chat) => 
          chat.chatId === data.chatId 
            ? { 
                ...chat, 
                lastMessage: data.text,
              } 
            : chat
        )
      );
    } else if (data.messageType === 'ANNOUNCEMENT') {
      setAnnouncements((prevAnnouncements) => ({
        ...prevAnnouncements,
        [data.chatId]: [...(prevAnnouncements[data.chatId] || []), data],
      }));

      // Optionally update chats for announcements as well
      setChats((prevChats) => 
        prevChats.map((chat) => 
          chat.chatId === data.chatId 
            ? { 
                ...chat, 
                lastAnnouncement: data.text,
                lastAnnouncementTimestamp: data.sentAt // Assuming the server sends a sentAt field
              } 
            : chat
        )
      );
    }
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/all');
      if (response.ok) {
        const data = await response.json();
        setChats(data);
        return data;
      } else {
        throw new Error('Failed to fetch chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to fetch chats. Please try again.');
      return [];
    }
  }, []);

  const connectWebSocket = useCallback(async () => {
    const attemptConnection = async () => {
      if (WebSocketService.isConnected()) {
        return true;
      }
      
      if (WebSocketService.isConnecting()) {
        return false;
      }

      try {
        await WebSocketService.connect();
        
        WebSocketService.subscribe('/topic/chats', handleChatUpdate);
        const fetchedChats = await fetchChats();
        fetchedChats.forEach((chat: Chat) => {
          WebSocketService.subscribe(`/topic/chat/${chat.chatId}`, handleChatMessage);
        });
        setChats(fetchedChats);
        
        console.log('WebSocket connected successfully');
        setIsLoading(false);
        setError(null);
        return true;
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setError('Connection failed. Retrying...');
        // Ensure the stompClient is properly cleaned up
        WebSocketService.disconnect();
        return false;
      }
    };

    while (true) {
      const connected = await attemptConnection();
      if (connected) break;
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 0.5 second before retrying
    }
  }, [fetchChats, handleChatUpdate, handleChatMessage]);

  useEffect(() => {
    const connect = async () => {
      try {
        await connectWebSocket();
      } catch (error) {
        console.error('WebSocket connection error:', error);
        // Attempt to reconnect after a delay
        setTimeout(() => connect(), 5000);
      }
    };
    
    connect();
    
    return () => {
      WebSocketService.disconnect();
    };
  }, [connectWebSocket]);

  const fetchChatMessages = useCallback(async (chatId: number) => {
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
          throw new Error('Failed to fetch chat messages');
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        toast({
          title: "Error",
          description: "Failed to fetch chat messages. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [messages]);

  const sendMessage = useCallback(async (message: Omit<Message, 'messageId' | 'sentAt'>) => {
    try {
      // Optimistically update the UI
      const tempMessage = {
        ...message,
        messageId: Date.now(), // Temporary ID
        sentAt: new Date().toISOString(),
      };
      setMessages(prevMessages => ({
        ...prevMessages,
        [message.chatId]: [...(prevMessages[message.chatId] || []), tempMessage]
      }));
      
      // Send the message to the server
      WebSocketService.sendMessage('/app/sendMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const sendAnnouncement = useCallback(async (announcement: Omit<Announcement, 'announcementId' | 'sentAt'>) => {
    try {
      WebSocketService.sendMessage('/app/sendAnnouncement', announcement);
    } catch (error) {
      console.error('Error sending announcement:', error);
      toast({
        title: "Error",
        description: "Failed to send announcement. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <GlobalChatContext.Provider 
      value={{ 
        chats, 
        messages,
        announcements,
        selectedChat, 
        setSelectedChat, 
        sendMessage,
        sendAnnouncement,
        fetchChatMessages,
        isLoading,
        error,
        reconnect: connectWebSocket
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