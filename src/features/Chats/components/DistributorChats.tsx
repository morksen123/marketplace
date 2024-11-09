import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { DistributorIndividualChat } from './DistributorIndividualChat';
import { Chat } from '@/types/chat';
import { useAtom } from 'jotai';
import { searchTermAtom, sortedChatsAtom, selectedChatAtom } from '@/atoms/chatAtoms';

export const DistributorChats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [sortedChats] = useAtom(sortedChatsAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

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
                  ? 'bg-[#e8f5fe] border-l-4 border-[#22C55E]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex flex-col items-start w-full">
                <h3 className="font-semibold text-gray-800">
                  {chat.administratorId ? 'Administrator' : `${chat.firstName} ${chat.lastName}`}
                </h3>
                <p className="text-xs italic text-[#22C55E]">{chat.firstName}</p>
                <p className="text-sm text-gray-600 mt-1 w-full truncate text-left">
                  {chat.lastMessage?.slice(0, 60)}
                  {chat.lastMessage && chat.lastMessage.length > 60 ? '...' : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 flex flex-col bg-white">
        <DistributorIndividualChat />
      </div>
    </div>
  );
};

//   return (
//     <div className="flex h-[80vh] bg-gray-100">
//       {/* Left side - Chat list */}
//       <div className="w-1/3 border-r flex flex-col bg-white shadow-md">
//         <div className="p-5 bg-white border-b border-gray-200">
//           <div className="relative">
//             <input
//               type="text"
//               className="w-full px-4 py-2 pl-10 pr-4 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Search chats"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//             <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           </div>
//         </div>
//         <ul className="overflow-y-auto flex-grow">
//           {sortedChats.map((chat) => (
//             <li
//               key={chat.chatId}
//               className={`p-4 cursor-pointer transition-colors duration-300 ${
//                 selectedChat?.chatId === chat.chatId
//                   ? 'bg-[#e8f5fe] border-l-4 border-[#22C55E]'
//                   : 'hover:bg-gray-50'
//               }`}
//               onClick={() => handleSelectChat(chat)}
//             >
//               <div className="flex flex-col items-start w-full">
//                 <h3 className="font-semibold text-gray-800">
//                   {chat.administratorId ? 'Administrator' : `${chat.firstName} ${chat.lastName}`}
//                 </h3>
//                 <p className="text-xs italic text-[#22C55E]">{chat.buyerEmail}</p>
//                 <p className="text-sm text-gray-600 mt-1 w-full truncate text-left">
//                   {chat.lastMessage?.slice(0, 60)}
//                   {chat.lastMessage && chat.lastMessage.length > 60 ? '...' : ''}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Right side - Individual chat */}
//       <div className="w-2/3 flex flex-col bg-white">
//         <DistributorIndividualChat
//           selectedChat={selectedChat}
//           stompClient={stompClient}
//           senderId={senderId}
//         />
//       </div>
//     </div>
//   );
// };
