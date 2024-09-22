import React, { useState, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

export const Chats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', name: 'John Doe', lastMessage: 'Hello there!', avatar: '/path/to/avatar1.jpg' },
    { id: '2', name: 'Jane Smith', lastMessage: 'How are you?', avatar: '/path/to/avatar2.jpg' },
    // Add more mock chats as needed
  ]);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStartNewChat = () => {
    // Implement logic to start a new chat
    console.log('Starting a new chat');
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implement logic to send the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implement logic to handle the attached file
      console.log('File attached:', file.name);
    }
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
                placeholder="Search chats"
                value={searchTerm}
                onChange={handleSearch}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <ul className="overflow-y-auto flex-grow">
          {filteredChats.map((chat) => (
            <li 
              key={chat.id} 
              className={`p-3 flex items-start hover:bg-gray-100 cursor-pointer ${selectedChat?.id === chat.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelectChat(chat)}
            >
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-grow">
                <h3 className="font-semibold text-left">{chat.name}</h3>
                <p className="text-sm text-gray-600 text-left">{chat.lastMessage}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Chat window */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full mr-3 mr-5" />
              <h2 className="text-xl font-semibold">{selectedChat.name}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              {/* Chat messages would go here */}
            </div>
            <div className="border-t p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleAttachment}
                  className="ml-2 p-2 text-green-500 hover:text-green-600 focus:outline-none"
                >
                  <AttachFileIcon className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 p-2 button button-green rounded-full"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};
