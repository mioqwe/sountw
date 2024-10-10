import { PUBLIC_HOST as host } from '$env/static/public'
import { get } from "svelte/store";
import { tokens as storeTokens } from '$lib/store';


export async function ftch(url, method, tokens=null, bodyData = null, updating=false) {

    console.log("ftch function")

    let options = {
        method: method,
        headers: {},
    };

    if (tokens != null || tokens != undefined && tokens.access) {
        options.headers["Authorization"] = `Bearer ${tokens.access}`;
    }

    // Add body data if provided
    if (bodyData instanceof FormData) {
        console.log(options.headers)
        options.body = bodyData;
    } else if (bodyData !== null) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(bodyData);
    } else {
        options.headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${host}${url}`, options);
    // console.log(res)
    if (res.status === 200) {
        return res
    }
    if (res.status === 401 && updating === false) {
        const newtokens = get(storeTokens)
        const refreshData = {"refresh": newtokens.refresh}
        console.log("refreshData")
        console.log(refreshData)
        const refreshRes = await ftch('/api/token/refresh/', "POST", null, refreshData, updating=true)
        console.log("refresh Res")
        console.log(refreshRes)
        if (refreshRes.status === 200) {
            const refreshData = await refreshRes.json()
            console.log("refresh data: ", refreshData)


            const updatedStoreTokens = {
            ...get(storeTokens),
            access: refreshData.access,
            };

            storeTokens.set(updatedStoreTokens);

            console.log(tokens)

            const fetchWithRefreshToken = await ftch(url, method, updatedStoreTokens, bodyData, updating=false)
            console.log("fetching with new access token")
            console.log(fetchWithRefreshToken)
            return fetchWithRefreshToken


        } else {
            // location.href = "/login"
            return res
        }
        // console.log("refreshed access token: ", refreshRes)
        // return refreshRes

    } else if (res.status === 401 && updating === true) {
        location.href = "/login"
        return res
    } else {
        return res
    }

}