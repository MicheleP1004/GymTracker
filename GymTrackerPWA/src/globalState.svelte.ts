import type { QueryDocumentSnapshot } from "firebase/firestore";
import { addFriend, deleteFriendship, deleteRequest, fetchChat } from "./firestore";

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
    console.log("Friends:", u.friends.join(", ")); // Stampa la lista di amici come una stringa separata da virgola
    console.log("Workouts:", u.workouts); // Presumibilmente un array di oggetti Allenamento
    console.log("Plans:", u.plans); // Presumibilmente un array di oggetti Plan
    console.log("Profile Picture URL:", u.propic);
    console.log("Requests:", u.requests.join(", ")); // Stampa la lista delle richieste come una stringa separata da virgola
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

export class ChatManager{
    chats:Chat[]=[];
    tail:number=0;
    head:number=0;

    public async addChat(id1: string, id2: string): Promise<Chat|null> {
        // Controlla se la chat esiste già
        const existingIndex = this.chats.findIndex(
          (c) => c.users.includes(id1) && c.users.includes(id2)
        );
      
        if (existingIndex !== -1) {
          // Se esiste, sposta la chat esistente in coda
          const existingChat = this.chats[existingIndex];
          // Sposta la chat in coda se non è già lì
          if (existingIndex !== this.tail) {
            this.head = this.tail;
            this.tail = (this.tail + 1) % maxChats;
          }
          return existingChat;
        }
      
        // Recupera la chat da Firestore se non esiste
        const chat = await fetchChat(id1, id2);
        // const chat = await fetchChat(id1, id2, maxMsg);

        if(!chat){return null};
      
        if (this.chats.length < maxChats) {
          // Se c'è ancora spazio, aggiungi la chat
          this.chats.push(chat);
          this.tail = (this.tail + 1) % maxChats;
        } else {
          // Se non c'è spazio, sostituisci la chat più vecchia
          this.chats[this.tail] = chat;
          this.head = (this.tail + 1) % maxChats;
          this.tail = (this.tail + 1) % maxChats;
        }
      
        return chat;
      }
      

    public getChats(): Chat[] {
        return this.chats;
      }

    public getChat(id1: string, id2: string): Chat | null {
        return this.chats.find(chat => chat.users.includes(id1) && chat.users.includes(id2)) || null;
    }
      
}

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

// export function setAllenamenti(a:Allenamento[]){
//     stato.workouts = a;
// }

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

