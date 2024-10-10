<script>
    import { ftch } from "$lib/fetch"
    import { tokens, user } from "$lib/store"
    import { PUBLIC_HOST as host } from "$env/static/public"
	import { get } from "svelte/store";
    async function login(event) {
        const formData = new FormData(event.target)
        const res = await fetch(`${host}/api/token/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"username": formData.get("username"), "password": formData.get("password")})
        })
        const response = await res.json()
        
        if (res.status === 200 ) {
            tokens.set(response)
            const getUser = await ftch("/get/user/", "GET", response, null)
            const getUserResponse = await getUser.json()
            if (getUser.status === 200) {
                user.set(getUserResponse)
                console.log(getUserResponse)
                location.href = '/'
            }
        } 
        console.log(response)

    }

</script>


<form class="flex flex-col gap-2 mx-auto max-w-[300px] mt-[100px]" on:submit={(e) => login(e)}>
    <fieldset class="flex flex-col gap-1">
        <label for="username" class="font-bold">Enter username:</label>
        <input 
        class="bg-gray-300 rounded-lg p-1"
        type="text" name="username" id="username">

    </fieldset>

    <fieldset class="flex flex-col gap-1">
        <label for="password" class="font-bold">Enter your password:</label>
        <input 
        class="bg-gray-300 rounded-lg p-1"
        type="password" name="password" id="password">
    </fieldset>
    <button type="submit" class="border border-gray-300 rounded-lg py-1 mt-1 font-bold">Login</button>
</form>