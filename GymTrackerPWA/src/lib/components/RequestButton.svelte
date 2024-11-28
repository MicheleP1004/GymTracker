<script lang="ts">
	import { getUserDataAsFriend } from "../../firestore";
	import { acceptRequest, denyRequest, Friend } from "../../globalState.svelte";
	import Loading from "./Loading.svelte";


    let { sender }: { sender: string } = $props();

    let user:Friend = $state(new Friend());

    function accept() {
        acceptRequest(sender);
    }

    function deny() {
        denyRequest(sender);
    }

    let loading:boolean = $state(true);
    let data:boolean = $state(false);

    async function fetchData(sender:string){
        try{
            
            let u:Friend|null = await getUserDataAsFriend(sender);
            if(u){
                user = u;
                data = true;
            }else{
                throw new Error("Utente non trovato");
            }
        }catch(e){
            console.log("Errore nel recupero infomazioni:"+{e});
        }
    }

    //da aggiungere formattazione delle info
    $effect(()=>{
        fetchData(sender);
        loading = !(data);
    })
</script>

<style>
    .box {
        display: grid;
        align-items: center;
        background-color: #ffffff;
        height: 11%;
        width: 100%;
        padding: 1%;
        box-sizing: border-box;
        grid-template-columns: 80% 10% 10%;
    }
    .text {
        margin-left: 2%;
        font-style: normal;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 500;
    }
    .button {
        cursor: pointer;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        align-items: center;
        align-self: center;
    }
    .accept {
        color: rgb(0, 0, 0);
        background-color: #ffffff;
    }
    .accept:hover{
        background-color: #72b987;
    }
    .deny {
        background-color: #ffffff;
        color: rgb(0, 0, 0);
    }
    .deny:hover{
        background-color: #b97772;
    }
</style>

{#if loading}
    <Loading></Loading>
{:else}
    <div class="box">
        <p class="text">{user.username}</p>
        <button class="button accept" onclick={accept}>Accetta</button>
        <button class="button deny" onclick={deny}>Rifiuta</button>
    </div>
{/if}
