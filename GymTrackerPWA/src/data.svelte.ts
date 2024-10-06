import { getExercises,getSchede,getWorkouts,saveAllenamento,saveEsercizio,savePlan,deleteAllenamento,deleteEsercizio,deletePlan } from "./firestore";
import { addAllenamento,addPlan,removeAllenamento,removePlan,stato } from "./globalState.svelte"

//classi per gestione allenamenti
export type tipo = 'cardio'|'flex'|'strength'|null;

export class Flags{
    fetchE : boolean = $state(false);
    fetchS : boolean = $state(false);
    fetchW : boolean = $state(false);
}

export let flags = new Flags();

export class Esercizio{
    owner:string = $state('');
    name:string= $state('');
    descrizione : string= $state('');
    tipo: tipo= $state(null);

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
    owner:string= $state('');
    name:string= $state('');
    descrizione : string= $state('');
    esercizi: {ides:string,serie?:number}[]= $state([]);
    
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

export type set = {
    reps?:number,
    peso?:number,
    durata?:number,
    distanza?:number
}

export type exSets = {ex:set[]}

export class Workout{
    owner:string= $state('');
    date:string = $state(new Date().toDateString());
    plan:string = $state('');
    sets: exSets[] = $state([]);
    
    constructor(
        owner:string,
        date:string,
        plan:string,
        sets: exSets[]
    ){
        this.owner = owner;
        this.date = date;
        this.plan = plan;
        this.sets = sets;
    }
}

export const schede:Scheda[] = $state([]);
export const esercizi:Esercizio[] = $state([]);
export const allenamenti:Workout[] = $state([]);

export function setScheda(s:Scheda){
    schede.push(s);
    addPlan(s.name);
    //registrazione su firestore
    savePlan(s);
}

export function setWorkout(w:Workout){
    allenamenti.push(w);
    addAllenamento(w.plan,w.date);
    //registrazione su firestore
    saveAllenamento(w);
}

export function setEsercizio(newEsercizio:Esercizio){
    esercizi.push(newEsercizio);
    console.log(newEsercizio.name);
    //registrazione su firestore
    saveEsercizio(newEsercizio);
}

export function delScheda(s:Scheda){
    let index:number = schede.indexOf(s);
    if(index != -1)
        schede.splice(index, 1);
    removePlan(s.owner);
    deletePlan(s.owner,s.name);
}

export function delEsercizio(e:Esercizio){
    let index:number = esercizi.indexOf(e);
    if(index != -1)
        esercizi.splice(index, 1);
    deleteEsercizio(e.owner,e.name);
}

export function delWorkout(w:Workout){
    let index:number = allenamenti.indexOf(w);
    if(index != -1)
        allenamenti.splice(index, 1);
    removeAllenamento(w.plan,w.date);
    deleteAllenamento(w.owner,w.plan,w.date);
}

export async function fetchEsercizi(uid:string):Promise<boolean> {
    if(flags.fetchE){
        return true
    }

    try{
        let appo:Esercizio[]|null = await getExercises(uid);
        if(appo){
            //soluzione brutta
            esercizi.splice(0,esercizi.length+1);
            for(let e of appo){
                esercizi.push(e);
            }
        }
        
        flags.fetchE = true;
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

export async function fetchSchede(uid:string):Promise<boolean> {
    if(flags.fetchS){
        return true
    }
    try{
        let appo:Scheda[]|null = await getSchede(uid);
        if(appo){
            //soluzione brutta
            schede.splice(0,schede.length);
            for(let s of appo){
                schede.push(s);
            }
        }
        flags.fetchS = true;
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

export async function fetchWorkouts(uid:string):Promise<boolean> {
    if(flags.fetchW){
        return true
    }

    try{
        let appo:Workout[]|null = await getWorkouts(uid);
        if(appo){
            //soluzione brutta 
            allenamenti.splice(0,allenamenti.length);
            for(let w of appo){
                allenamenti.push(w);
            }
        }
        flags.fetchW = true;
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

export function getType(id:string):string{
    return esercizi.find((item)=>item.name === id)!.tipo!;
}

export function existWorkout(date:string,plan:string):boolean{
    return allenamenti.some(workout => workout.date === date && workout.plan === plan);
}

export function getWorkout(date:string,plan:string):Workout | null{
    const workout = allenamenti.find(w => w.date === date && w.plan === plan);
    return workout || null;
}

export function getScheda(name:string):Scheda | null{
    const scheda = schede.find(s => s.name === name);
    return scheda || null;
}

export function getEsercizio(name:string):Esercizio | null{
    const es = esercizi.find(e => e.name === name);
    return es || null;
}

export function getEsercizi(names:string[]):(Esercizio | null)[]{
    let array:(Esercizio | null)[] = [];
    for(let n of names){
        array.push(getEsercizio(n)||null);
    }
    return array || null;
}