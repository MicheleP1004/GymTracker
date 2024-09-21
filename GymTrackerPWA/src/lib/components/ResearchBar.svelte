<script lang="ts">
    //array di prova
    let users: string[] = ["Mario Rossi", "Luigi Verdi", "Giovanni Bianchi", "Anna Neri", "Sara Gialli"];
    
    let searchTerm: string = '';

    //funzione per filtrare gli utenti in base al termine di ricerca
    function filteredUsers(): string[] {
        return users.filter(user => 
            user.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
</script>

<style>
    .search-container {
        top :25%;
        position: relative;
        width: 100%;
        /* max-width: 300px; */
        margin-bottom: 1em;
    }

    .search-bar {
        padding: 0.5em;
        font-size: 1.2em;
        width: 100%;
        box-sizing: border-box;
        border-radius: 12px;
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
        cursor: pointer;
    }

    .dropdown li:hover {
        background-color: #f0f0f0;
    }
    .text{
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<div class="search-container">
    <input 
        type="text" 
        bind:value={searchTerm} 
        placeholder="Cerca utente..."
        class="search-bar" 
    />
    
    {#if searchTerm && filteredUsers().length > 0}
    <ul class="dropdown">
        {#each filteredUsers() as user}
            <li class="text">{user}</li>
        {/each}
    </ul>
    {/if}
</div>
