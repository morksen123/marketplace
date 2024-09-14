import { UserInfo } from '@/types/api';
import { atom } from 'jotai';

export const userAtom = atom<UserInfo | null>();
