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
import { notificationsAtom } from '@/atoms/notificationAtoms';
import { Notification } from '@/types/notification';
import { useAuthStatus } from '@/features/Authentication/hooks/useAuthStatus';

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

export const GlobalChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useAtom(chatsAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [announcements] = useAtom(announcementsAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const { isAuthenticated } = useAuthStatus();

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

  const fetchSelectedChat = useCallback(async (chatId: number) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedChat(data);
        return data;
      } else {
        throw new Error('Failed to fetch selected chat');
      }
    } catch (error) {
      console.error('Error fetching selected chat:', error);
      setError('Failed to fetch selected chat. Please try again.');
      return null;
    }
  }, []);

  const handleChatUpdate = useCallback((message: any) => { // this isnt really being used. but i will clean it up later.
    const updatedChat = JSON.parse(message.body);
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.chatId === updatedChat.chatId ? { ...chat, ...updatedChat } : chat
      )
    );
  }, []);

  const handleChatMessage = useCallback((message: any) => { // this is da key!
    const data = JSON.parse(message.body);
    console.log('Message received:', data);

    const updatedChats = fetchChats();
    // Update chats
    const update = async () => {
      const resolvedChats = await updatedChats;
      setChats(resolvedChats);
    };

    const updateSelectedChat = async () => {
      if (selectedChat?.chatId) {
        const resolvedChat = await fetchSelectedChat(selectedChat.chatId);
        setSelectedChat(resolvedChat);
      }
    };
    
    update();
    updateSelectedChat();
  }, [setChats, fetchSelectedChat, selectedChat]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        return data;
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please try again.');
      return [];
    }
  }, []);

  const handleNotification = useCallback((message: any) => {
    const data = JSON.parse(message.body);
    console.log('Received notification:', data);

    const updatedNotifications = fetchNotifications();
    const update = async () => {
      const resolvedNotifications = await updatedNotifications;
      setNotifications(resolvedNotifications);
    };

    update();
  }, [setNotifications, fetchNotifications]);

  const connectWebSocket = useCallback(async () => {
    console.log('Connecting WebSocket...');
    if (!isAuthenticated) {
      console.log('User is not authenticated. Skipping WebSocket connection.');
      return;
    }

    const attemptConnection = async () => {
      if (WebSocketService.isConnected()) {
        return true;
      }
      
      if (WebSocketService.isConnecting()) {
        return false;
      }

      try {
        await WebSocketService.connect();
        console.log('WebSocket connected successfully');

        console.log('Subscribing to notifications...');
        WebSocketService.subscribe(`/topic/notifications`, handleNotification);
        console.log('Subscribed to notifications');

        const fetchedNotifications = await fetchNotifications();
        if (fetchedNotifications) {
          setNotifications(fetchedNotifications);
        }
        
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
  }, [fetchChats, handleChatUpdate, handleChatMessage, isAuthenticated, fetchNotifications, handleNotification]);

  useEffect(() => {
    console.log('useEffect for WebSocket connection. isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Authenticated, attempting to connect WebSocket');
      const connect = async () => {
        try {
          await connectWebSocket();
        } catch (error) {
          console.error('WebSocket connection error:', error);
          setTimeout(() => connect(), 5000);
        }
      };
      
      connect();
      
      return () => {
        console.log('Cleaning up WebSocket connection');
        WebSocketService.disconnect();
      };
    }
  }, [connectWebSocket, isAuthenticated]);

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

  const sendNotification = useCallback(async (notification: Omit<Notification, 'notificationId' | 'sentAt'>) => {
    try {
      WebSocketService.sendMessage('/app/sendNotification', notification);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
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
        notifications,
        sendNotification,
        fetchNotifications,
        isLoading,
        error,
        reconnect: connectWebSocket,
        isAuthenticated: isAuthenticated as boolean
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
