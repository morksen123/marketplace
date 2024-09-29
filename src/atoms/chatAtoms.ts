import { atom } from 'jotai';
import { Chat, Message, Announcement } from '@/types/chat';

export const chatsAtom = atom<Chat[]>([]);
export const messagesAtom = atom<{ [chatId: number]: Message[] }>({});
export const announcementsAtom = atom<{ [chatId: number]: Announcement[] }>({});
export const selectedChatAtom = atom<Chat | null>(null);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

export const filteredChatsAtom = atom((get) => {
  const chats = get(chatsAtom);
  const searchTerm = get(searchTermAtom);
  return chats.filter((chat) =>
    chat.distributorName
      ? chat.distributorName.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );
});

export const sortedChatsAtom = atom((get) => {
  const filteredChats = get(filteredChatsAtom);
  return [...filteredChats].sort((a, b) => {
    if (a.administratorId && !b.administratorId) return -1;
    if (!a.administratorId && b.administratorId) return 1;
    return 0;
  });
});

export const searchTermAtom = atom('');