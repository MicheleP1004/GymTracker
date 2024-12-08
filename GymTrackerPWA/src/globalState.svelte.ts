import type { QueryDocumentSnapshot } from "firebase/firestore";
import { addFriend, deleteFriendship, deleteRequest, fetchChat } from "./firestore";
import { startChatListener, stopChatListener } from "./listener";

export const maxChats:number=3;
export const maxMsg:number = 10;

export const defaultPic:string = "/DefaultPics/ProfilePicture.jpg";

export class Utente{
    uid: string= $state('');
    email: string= $state('');
    username: string= $state('');
    bio: string= $state('');
    friends: string[]= $state([]);
    workouts: Allenamento[]= $state([]);
    plans: Plan[]= $state([]);
    propic: string = $state('');
    requests:string[] = $state([]);
    pushToken:string = $state('');

    constructor(){
        this.uid= '';
        this.email= '';
        this.username= '';
        this.bio= '';
        this.friends= [];
        this.workouts= [];
        this.plans= [];
        this.propic = "/DefaultPics/ProfilePicture.jpg";
        this.requests=[];
        this.pushToken='';
    }
}

export function setUtente(newUser:Utente) {
    stato.uid = newUser.uid;
    stato.email = newUser.email;
    stato.username = newUser.username;
    stato.bio = newUser.bio;
    stato.friends = newUser.friends;
    stato.workouts = newUser.workouts;
    stato.plans = newUser.plans;
    stato.propic = newUser.propic || "/DefaultPics/ProfilePicture.jpg";
    stato.requests = newUser.requests;
    stato.pushToken = newUser.pushToken;
}

export function getUtente() {
    return stato;
}

export function printUtente(u:Utente){
    console.log("UID:", u.uid);
    console.log("Email:", u.email);
    console.log("Username:", u.username);
    console.log("Bio:", u.bio);
    console.log("Friends:", u.friends.join(", "));
    console.log("Workouts:", u.workouts);
    console.log("Plans:", u.plans);
    console.log("Profile Picture URL:", u.propic);
    console.log("Requests:", u.requests.join(", "));
    console.log("Push Token:", u.pushToken);
}

//classi per gestione chat e amici
export type Message={
    sender:string;
    text:string;
    timestamp:number;
}

export class Chat{
    users:string[]=[];
    messages:Message[]=$state([]);
    // cursor:QueryDocumentSnapshot|null=null;

    constructor(id1:string,id2:string,mes:Message[],cursor?:QueryDocumentSnapshot){
        this.users=[id1,id2];
        this.messages=mes;
        // this.cursor=cursor||null;
    }
}

export class ChatManager {
    chats: Chat[] = [];
    tail: number = 0;
    head: number = 0;
    private listeners: Map<string, () => void> = new Map();
  
    private getChatKey(id1: string, id2: string): string {
      return [id1, id2].sort().join("_");
    }
  
    private addListener(chatKey: string, chat: Chat) {
      const unsubscribe = startChatListener(chatKey, (updatedChatData) => {
        chat.messages.push(...updatedChatData.messages || []);
        console.log(`Aggiornati i messaggi per la chat ${chatKey}`);
      });
  
      this.listeners.set(chatKey, unsubscribe);
      console.log(`Listener avviato per la chat ${chatKey}`);
    }
  
    private removeListener(chatKey: string) {
      const unsubscribe = this.listeners.get(chatKey);
      if (unsubscribe) {
        stopChatListener(unsubscribe);
        this.listeners.delete(chatKey);
        console.log(`Listener rimosso per la chat ${chatKey}`);
      }
    }
  
    public async addChat(id1: string, id2: string): Promise<Chat | null> {
      const chatKey = this.getChatKey(id1, id2);

      const existingIndex = this.chats.findIndex(
        (c) => this.getChatKey(c.users[0], c.users[1]) === chatKey
      );
  
      if (existingIndex !== -1) {
        const existingChat = this.chats[existingIndex];
        if (existingIndex !== this.tail) {
          this.head = this.tail;
          this.tail = (this.tail + 1) % maxChats;
        }
        return existingChat;
      }

      //recupera la chat
      const chatData = await fetchChat(id1, id2);
      if (!chatData) return null;
  
      const chat = new Chat(id1, id2, chatData.messages);
  
      //aggiunge o sostituisce la chat nel buffer circolare
      if (this.chats.length < maxChats) {
        this.chats.push(chat);
        this.tail = (this.tail + 1) % maxChats;
      } else {
        const oldestChat = this.chats[this.tail];
        const oldestKey = this.getChatKey(oldestChat.users[0], oldestChat.users[1]);
        this.removeListener(oldestKey);
  
        this.chats[this.tail] = chat;
        this.head = (this.tail + 1) % maxChats;
        this.tail = (this.tail + 1) % maxChats;
      }
  
      this.addListener(chatKey, chat);
      return chat;
    }
  
    public removeChat(id1: string, id2: string): void {
      const chatKey = this.getChatKey(id1, id2);
      const index = this.chats.findIndex(
        (chat) => this.getChatKey(chat.users[0], chat.users[1]) === chatKey
      );
  
      if (index !== -1) {
        this.chats.splice(index, 1);
        this.removeListener(chatKey);
      }
    }
  
    public getChats(): Chat[] {
      return this.chats;
    }
  
    public getChat(id1: string, id2: string): Chat | null {
      return this.chats.find(
        (chat) => this.getChatKey(chat.users[0], chat.users[1]) === this.getChatKey(id1, id2)
      ) || null;
    }
  }
// export class ChatManager{
//     chats:Chat[]=[];
//     tail:number=0;
//     head:number=0;

//     public async addChat(id1: string, id2: string): Promise<Chat|null> {
//         const existingIndex = this.chats.findIndex(
//           (c) => c.users.includes(id1) && c.users.includes(id2)
//         );
      
//         if (existingIndex !== -1) {
//           const existingChat = this.chats[existingIndex];
//           if (existingIndex !== this.tail) {
//             this.head = this.tail;
//             this.tail = (this.tail + 1) % maxChats;
//           }
//           return existingChat;
//         }
      
//         const chat = await fetchChat(id1, id2);
//         // const chat = await fetchChat(id1, id2, maxMsg);

//         if(!chat){return null};
      
//         if (this.chats.length < maxChats) {
//           this.chats.push(chat);
//           this.tail = (this.tail + 1) % maxChats;
//         } else {
//           this.chats[this.tail] = chat;
//           this.head = (this.tail + 1) % maxChats;
//           this.tail = (this.tail + 1) % maxChats;
//         }
      
//         return chat;
//       }

//     public getChats(): Chat[] {
//         return this.chats;
//       }

//     public getChat(id1: string, id2: string): Chat | null {
//         return this.chats.find(chat => chat.users.includes(id1) && chat.users.includes(id2)) || null;
//     }
      
// }

export const chats=new ChatManager();

export class Friend{
    uid: string= $state('');
    username: string= $state('');
    propic: string = $state('');
}

export class Plan{
    name:string = $state('');
}

export class Allenamento{
    date: string = $state(new Date().toISOString().substring(0, 10));
    plan: string = $state('');
}

export function addAllenamento(piano:string,data:string){
    stato.workouts.push({plan:piano,date:data}as Allenamento);
}

export function addPlan(nome:string){
    stato.plans.push({name:nome}as Plan);
}

export function removeAllenamento(piano:string,data:string){
    // console.log(stato.workouts.length);
    stato.workouts = stato.workouts.filter(
        (workout) => !(workout.plan === piano && workout.date === data)
    );
    // console.log(stato.workouts.length);
}

export function removePlan(nome:string){
    stato.plans = stato.plans.filter(
        (plan) => plan.name !== nome
    );
}

export function acceptRequest(id:string){
    addFriend(stato.uid,id);
    stato.friends.push(id);
    deleteRequest(id,stato.uid);
    removeRequest(id);
}

export function denyRequest(id:string){
    deleteRequest(id,stato.uid);
    removeRequest(id);
}

export function removeRequest(id: string) {
    //filtra l'array delle richieste
    stato.requests = stato.requests.filter(request => request !== id);

    console.log(`Richiesta con ID ${id} rimossa con successo.`);
}

export async function removeFriend(id:string){
    // let f:string[] = stato.friends.filter(friend => friend === id);
    // console.log(f.length,"!");
    //filtra l'array degli amici
    stato.friends = stato.friends.filter(friend => friend !== id);

    for(let a of stato.friends){
        console.log(a);
    }

    await deleteFriendship(stato.uid,id);
}

export function updateFriends(newFriends: string[]) {
    stato.friends = newFriends; 
}

export function updateRequests(newRequests: string[]) {
    stato.requests = newRequests; 
}

export const stato = new Utente();

