<script lang="ts">
	import { deliverRequest, fetchUsersWithTerm, sendNotification } from "../../firestore";
	import { defaultPic, stato, type Friend } from "../../globalState.svelte";

    let searchTerm: string = '';
    let users: Friend[] = []; 
    let debounceTimeout: ReturnType<typeof setTimeout>;

    async function handleSearch(term: string): Promise<void> {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            if (term.trim() === '') {
                users = [];
                return;
            }
            users = await fetchUsersWithTerm(term); 
        }, 200); 
    }

    async function sendRequest(id:string){
        deliverRequest(id,stato.uid);
        let icon = stato.propic?stato.propic : "gs://gymtrackerpwa.appspot.com/ProfilePicture.jpg";
        icon = icon !== defaultPic? icon : "gs://gymtrackerpwa.appspot.com/ProfilePicture.jpg";
        await sendNotification(id,"Nuova richiesta!","Hai ricevuto una richiesta di amiciczia da "+stato.username,icon);
        alert("Richiesta inviata!");
    }
</script>

<style>
    .search-container {
        top: 25%;
        position: relative;
        width: 100%;
        margin-bottom: 1em;
    }

    .search-bar {
        padding: 0.5em;
        font-size: 1.2em;
        width: 100%;
        box-sizing: border-box;
        border-radius: 12px;
        border: 1px solid #ccc;
    }

    .dropdown {
        position: absolute;
        top: 100%; 
        left: 0;
        right: 0;
        max-height: 200px;
        overflow-y: auto;  
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        padding: 0;
        margin: 0;
        list-style: none;
        border-radius: 12px;
    }

    .dropdown li {
        padding: 0.5em;
        font-size: 1.1em;
        display: flex;
        align-items: center; 
        justify-content: space-between; 
    }

    .dropdown img {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        margin-right: 10px; 
    }

    .text {
        font-family: Arial, Helvetica, sans-serif;
    }

    .button {
        background-color: #ffffff;
        color: rgb(0, 0, 0);
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .button:hover {
        background-color: #88c9aa;
    }
</style>

<div class="search-container">
    <input 
        type="text" 
        bind:value={searchTerm} 
        oninput={() => handleSearch(searchTerm)} 
        placeholder="Cerca utente..." 
        class="search-bar" 
    />
    
    {#if searchTerm && users.length > 0}
    <ul class="dropdown">
        {#each users as u (u.uid)} 
            {#if u.uid != stato.uid }
                <li class="text">
                    <div style="display: flex; align-items: center;">
                        <img src={u.propic || defaultPic} alt={u.username} />
                        <p class="text" style="margin-right: 10px;">{u.username}</p>
                    </div>
                    {#if !stato.friends.find(x => x==u.uid)}
                        <button class="button" onclick={()=>{sendRequest(u.uid);}}>Aggiungi</button>
                    {/if}
                </li>
            {/if}
        {/each}
    </ul>
    {/if}
</div>
