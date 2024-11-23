
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

export const stato = new Utente();

