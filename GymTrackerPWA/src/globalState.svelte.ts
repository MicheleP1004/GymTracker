
export class Utente{
    uid: string= $state('');
    email: string= $state('');
    username: string= $state('');
    bio: string= $state('');
    friends: any[]= $state([]);
    workouts: any[]= $state([]);
    plans: any[]= $state([]);
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

export const stato = new Utente();

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

