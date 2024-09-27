// export type Utente = {
//     uid: string;
//     email: string;
//     username: string;
//     bio: string;
//     friends: any[];
//     workouts: any[];
//     plans: any[];
// }

export class Utente{
    // uid: string= $state('');
    // email: string= $state('');
    // username: string= $state('');
    // bio: string= $state('');
    // friends: any[]= $state([]);
    // workouts: any[]= $state([]);
    // plans: any[]= $state([]);
    uid: string= $state('');
    email: string= $state('');
    username: string= $state('');
    bio: string= $state('');
    friends: any[]= $state([]);
    workouts: any[]= $state([]);
    plans: any[]= $state([]);

    constructor (){
        this.uid='';
        this.email='';
        this.username='';
        this.bio='';
        this.friends=[];
        this.workouts=[];
        this.plans=[];
    };
}

// function creaUtente(){
//     let utente: Utente = new Utente();

//     function getUtente():Utente{
//         return utente;
//     }
    
//     function setUtente(user:Utente){
//         utente = user;
//         console.log(utente.email);
//     }

//     return {
//         get utente(){return utente},
//         set utente(u:Utente){utente = u},
//         getUtente,
//         setUtente
//     };
// }
 
// export const stato = creaUtente();

let stato = $state(new Utente());

export function setUtente(user: Utente) {
    stato.uid = user.uid;
    stato.email = user.email;
    stato.username = user.username;
    stato.bio = user.bio;
    stato.friends = user.friends;
    stato.workouts = user.workouts;
    stato.plans = user.plans;
}

export function getUtente() {
    return stato;
}

