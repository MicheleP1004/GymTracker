import { getExcercises,getSchede } from "./firestore";

//classi per gestione allenamenti
export type tipo = 'cardio'|'flex'|'strength'|null;

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

export const schede:Scheda[] = $state([]);
export const esercizi:Esercizio[] = $state([]);

export function setScheda(s:Scheda){
    schede.push(s);
}

export function setEsercizio(newEsercizio:Esercizio){
    esercizi.push(newEsercizio);
}

export function delScheda(s:Scheda){
    let index:number = schede.indexOf(s);
    if(index != -1)
        schede.splice(index, 1);
}

export function delEsercizio(e:Esercizio){
    let index:number = esercizi.indexOf(e);
    if(index != -1)
        esercizi.splice(index, 1);
}

export async function fetchEsercizi(uid:string):Promise<boolean> {
    try{
        if(esercizi.length == 0){
            let appo:Esercizio[]|null = await getExcercises(uid);
            // if(!appo){
            //     // esercizi = [];
            // }else{
            //     // esercizi=appo;
            //     for(let e of appo){}
            // }
            if(appo){
                for(let e of appo){
                    setEsercizio(e);
                }
            }
        }
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

export async function fetchSchede(uid:string):Promise<boolean> {
    try{
        if(schede.length == 0){
            let appo:Scheda[]|null = await getSchede(uid);
            // if(!appo){
            //     // esercizi = [];
            // }else{
            //     // esercizi=appo;
            //     for(let e of appo){}
            // }
            if(appo){
                for(let s of appo){
                    setScheda(s);
                }
            }
        }
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}