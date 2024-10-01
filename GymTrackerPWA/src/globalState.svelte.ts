
export class Utente{
    uid: string= $state('');
    email: string= $state('');
    username: string= $state('');
    bio: string= $state('');
    friends: Friend[]= $state([]);
    workouts: Allenamento[]= $state([]);
    plans: Plan[]= $state([]);
    propic: string = $state('');

    constructor(){
        this.uid= '';
        this.email= '';
        this.username= '';
        this.bio= '';
        this.friends= [];
        this.workouts= [];
        this.plans= [];
        this.propic = "/DefaultPics/ProfilePicture.jpg";
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
}

export function getUtente() {
    return stato;
}

//classi per gestione chat e amici
export class Chat{

}

export class GroupChat{

}

export class Friend{
    uid: string= $state('');
    username: string= $state('');
    propic: string = $state('');
}

export class Plan{
    name:string = $state('');
    descrizione : string = $state('');
}

export class Allenamento{
    date: string = $state(new Date().toString());
    plan: string = $state('');
    // ex: {es:Esercizio,pesi:number[]}[] = $state([]); 
}

export function setAllenamenti(a:Allenamento[]){
    stato.workouts = a;
}

export function addAllenamento(a:Allenamento){
    stato.workouts.push(a);
    //aggiungere memorizzazione del nuovo allenamento su firestore
}


export const stato = new Utente();

//classi per gestione allenamenti
export type tipo = 'cardio'|'flex'|'strength'|null;

export class Esercizio{
    owner:string;
    name:string;
    descrizione : string;
    tipo: tipo;

    constructor(
        owner:string,
        name:string,
        descrizione : string,
        tipo: tipo,){
            this.owner = owner;
            this.name = name;
            this.descrizione = descrizione;
            this.tipo = tipo;
        }
        
}

export class Scheda{
    owner:string;
    name:string;
    descrizione : string;
    esercizi: {ides:string,serie?:number}[];
    
    constructor(
        owner:string,
        name:string,
        descrizione : string,
        esercizi: {ides:string,serie?:number}[]
    ){
        this.owner = owner;
        this.name = name;
        this.descrizione = descrizione;
        this.esercizi = esercizi;
    }
}

