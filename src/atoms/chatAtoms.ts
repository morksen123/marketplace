import { atom } from 'jotai';
import { Chat, Message, Announcement } from '@/types/chat';

// Custom atom wrapper for logging
const createLoggedAtom = <T>(initialValue: T, name: string) => {
  const baseAtom = atom<T>(initialValue);
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      const nextValue = typeof update === 'function' ? (update as (prev: T) => T)(get(baseAtom)) : update;
      // console.log(`${name} updated:`, nextValue);
      set(baseAtom, nextValue);
    }
  );
  return derivedAtom;
};

// Replace existing atom declarations with logged versions
export const chatsAtom = createLoggedAtom<Chat[]>([], 'chatsAtom');
export const messagesAtom = createLoggedAtom<{ [chatId: number]: Message[] }>({}, 'messagesAtom');
export const announcementsAtom = createLoggedAtom<{ [chatId: number]: Announcement[] }>({}, 'announcementsAtom');
export const selectedChatAtom = createLoggedAtom<Chat | null>(null, 'selectedChatAtom');
export const isLoadingAtom = createLoggedAtom<boolean>(false, 'isLoadingAtom');
export const errorAtom = createLoggedAtom<string | null>(null, 'errorAtom');
export const searchTermAtom = createLoggedAtom('', 'searchTermAtom');

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