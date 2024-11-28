import { addFriend, deleteFriendship, deleteRequest } from "./firestore";

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
}

export function getUtente() {
    return stato;
}

//classi per gestione chat e amici
export class Chat{

}

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

