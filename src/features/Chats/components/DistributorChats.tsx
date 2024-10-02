import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { DistributorIndividualChat } from './DistributorIndividualChat';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface Chat {
  chatId: number;
  firstName: string;
  lastName: string;
  buyerId: string;
  buyerEmail: string; // Added buyerEmail
  lastMessage: string;
  administratorId: string | null;
}

export const DistributorChats: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);  // Use chatId initially
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);  // Full chat details will be stored here
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState([]); // Messages for the selected chat
  const [stompClient, setStompClient] = useState<any>(null);
  const [senderId, setSenderId] = useState<any>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat/distributor');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    const fetchDistributorId = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/distributor/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSenderId(data.distributorId);
        } else {
          console.error('Failed to fetch distributor ID');
        }
      } catch (error) {
        console.error('Error fetching distributor ID:', error);
      }
    };

    fetchChats();
    const chatIntervalId = setInterval(fetchChats, 1000);
    fetchDistributorId();

    // Check if chatId is passed via location state
    if (location.state?.chatId) {
      setSelectedChatId(location.state.chatId); // Set the selectedChatId from the state
      fetchChatDetails(location.state.chatId);  // Fetch the chat details based on chatId
    }

    return () => {
      clearInterval(chatIntervalId);
    };
  }, [location.state]);

  // Function to fetch full chat details based on chatId
  const fetchChatDetails = async (chatId: number) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`); // Fetch chat details by chatId
      if (response.ok) {
        const chat = await response.json();
        setSelectedChat(chat); // Set the full chat details to selectedChat
        connectToWebSocket(chat.chatId.toString());
      } else {
        console.error('Failed to fetch chat details');
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };

  const filteredChats = chats.filter((chat) =>
    (chat.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     chat.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     chat.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat); // Store the selected chat object
    connectToWebSocket(chat.chatId.toString());
  };

  const connectToWebSocket = (chatId: string) => {
    const socket = new SockJS('http://localhost:8080/chat-websocket');

    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = (frame: any) => {
      console.log('Connected to WebSocket:', frame);

      stompClient.subscribe(`/topic/chat/${chatId}`, (messageOutput: any) => {
        const message = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();

    setStompClient(stompClient);
  };

  // Sort chats to display administrator chat at the top
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.administratorId && !b.administratorId) return -1;
    if (!a.administratorId && b.administratorId) return 1;
    return 0;
  });

  return (
    <div className="flex h-[80vh] bg-gray-100">
      {/* Left side - Chat list */}
      <div className="w-1/3 border-r flex flex-col bg-white shadow-md">
        <div className="p-5 bg-white border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 pr-4 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search chats"
              value={searchTerm}
              onChange={handleSearch}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <ul className="overflow-y-auto flex-grow">
          {sortedChats.map((chat) => (
            <li
              key={chat.chatId}
              className={`p-4 cursor-pointer transition-colors duration-300 ${
                selectedChat?.chatId === chat.chatId
                  ? 'bg-[#e8f5fe] border-l-4 border-[#017A37]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex flex-col items-start w-full">
                <h3 className="font-semibold text-gray-800">
                  {chat.administratorId ? 'Administrator' : `${chat.firstName} ${chat.lastName}`}
                </h3>
                <p className="text-xs italic text-[#017A37]">{chat.buyerEmail}</p>
                <p className="text-sm text-gray-600 mt-1 w-full truncate text-left">
                  {chat.lastMessage?.slice(0, 60)}
                  {chat.lastMessage && chat.lastMessage.length > 60 ? '...' : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Individual chat */}
      <div className="w-2/3 flex flex-col bg-white">
        <DistributorIndividualChat
          selectedChat={selectedChat}
          stompClient={stompClient}
          senderId={senderId}
        />
      </div>
    </div>
  );
};
