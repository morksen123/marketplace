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
    chat.distributorName.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="flex h-full max-h-screen">
      {/* Left side - Chat list */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full px-4 py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search buyers"
                value={searchTerm}
                onChange={handleSearch}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <ul className="overflow-y-auto flex-grow">
          {sortedChats.map((chat) => (
            <li
              key={chat.chatId}
              className={`p-3 flex items-start hover:bg-gray-100 cursor-pointer ${selectedChat?.chatId === chat.chatId ? 'bg-gray-200' : ''
                }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex-grow">
                <h3 className="font-semibold text-left">
                  {chat.administratorId ? 'Administrator' : ''}
                </h3>
                <h3 className="font-semibold text-left">{chat.firstName} {chat.lastName}</h3>
                <p className="text-sm text-gray-600 text-left truncate">
                  {chat.lastMessage.slice(0, 60)}
                  {chat.lastMessage.length > 60 ? '...' : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 flex flex-col">
        <DistributorIndividualChat selectedChat={selectedChat} stompClient={stompClient} senderId={senderId} />
      </div>
    </div>
  );
};
