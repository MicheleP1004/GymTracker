import { writable } from 'svelte/store';

export interface Utente {
  uid: string;
  email: string;
  username?: string;
  bio?: string;
  friends?: any[];
  workouts?: any[];
  plans?: any[];
}

export const userStore = writable<Utente | null>(null);

export function setUser(userData: Utente):void {
  userStore.set(userData);
}

export function clearUser():void {
  userStore.set(null);
}

// export function getUser():Utente{
//   userStore.
// }

