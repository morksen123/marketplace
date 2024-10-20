import { atom } from "jotai";
import { Notification } from "@/types/notification";

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

export const notificationsAtom = createLoggedAtom<Notification[]>([], 'notificationsAtom');