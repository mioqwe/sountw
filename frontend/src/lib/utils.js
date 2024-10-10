import { ftch } from "$lib/fetch"
import { tokens } from "$lib/store"
import { get } from "svelte/store"


    // path('delete/song=<int:id>/', songs_views.delete, name="get songs list"),
export async function deleteTrackFromQueue(id) {
    const res = await ftch(`/delete/song=${id}/`, "GET", get(tokens))
    const response = await res.json()
    console.log(response)
}