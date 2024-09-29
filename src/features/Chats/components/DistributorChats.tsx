import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { DistributorIndividualChat } from './DistributorIndividualChat';
import { useGlobalChat } from '@/contexts/GlobalChatContext';
import { Chat } from '@/types/chat';

export const DistributorChats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, setSelectedChat } = useGlobalChat();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Force a re-render when chats change
    forceUpdate({});
  }, [chats]);

  const filteredChats = chats.filter((chat) =>
    `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.administratorId && !b.administratorId) return -1;
    if (!a.administratorId && b.administratorId) return 1;
    return 0;
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

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
                placeholder="Search"
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
              className={`p-3 flex items-start hover:bg-gray-100 cursor-pointer`}
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
        <DistributorIndividualChat />
      </div>
    </div>
  );
};