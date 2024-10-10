<script>
    import { user } from "$lib/store"
	import { onMount } from "svelte";
    import { get } from "svelte/store"
    let userData = {}
    
    onMount(() => {
        userData = get(user)
    })

</script>


<header 
    class="flex flex-row max-w-[720px] justify-between container mx-auto border border-gray-300 py-3 px-2 rounded-xl mt-4">
    <div class="font-bold ml-4">
        {#if userData.username}
            {userData.username}
        {:else}
            Streamer
        {/if}
    </div>
    <div>
        <a 
        class="font-bold mr-4 underline"
        href="/login">Login</a>
    </div>
</header>