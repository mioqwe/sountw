<script>
    import { PUBLIC_HOST as host } from "$env/static/public";
    import { onMount } from "svelte";
    import { deleteTrackFromQueue } from "$lib/utils"
    
    let embedUrl = ''; // The embed URL we'll generate
    let embedType = ''; // The type of embed (YouTube, Spotify, SoundCloud)
    let currentTrack = 0;
    let queue = [];
    let youtubePlayer; // Reference to the YouTube player
    let soundcloudWidget; // Reference to the SoundCloud player

    async function addSong(url) {
        const res = await fetch(`${host}/add/song/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "url": url })
        });
        const response = await res.json();
        if (res.status === 200) {
            url = ''
        }
        console.log(response);
    }

    // Function to generate the correct embed URL with autoplay based on the input
    function generateEmbedUrl(url) {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            let videoId = '';
            if (url.includes("youtu.be")) {
                // Extract video ID from short URL
                videoId = url.split("/").pop();
            } else {
                // Extract video ID from full URL
                const params = new URL(url).searchParams;
                videoId = params.get('v');
            }
            // Add autoplay parameter for YouTube
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`; // enable API for YouTube
            embedType = 'youtube';
            setTimeout(() => loadYoutubePlayer(), 500); // Load YouTube player
        } else if (url.includes("spotify.com")) {
            const spotifyId = url.split("/").pop();
            // Spotify doesn't natively support autoplay, but the iframe will still render
            embedUrl = `https://open.spotify.com/embed/track/${spotifyId}`;
            embedType = 'spotify';
        } else if (url.includes("soundcloud.com")) {
            // Add autoplay parameter for SoundCloud
            embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false`;
            embedType = 'soundcloud';
            setTimeout(() => loadSoundCloudPlayer(), 500); // Load SoundCloud player
        } else {
            embedUrl = ''; // Reset if the URL is not valid
            embedType = '';
        }
    }

    async function nextTrack() {
        const next = (currentTrack + 1) % queue.length;
        const prev = queue[currentTrack].id
            await deleteTrackFromQueue(prev)
        url = queue[next].url;
            queue = queue.splice(prev, 1)
        currentTrack = next;
        generateEmbedUrl(url);
    }

    // YouTube API handling
    function loadYoutubePlayer() {
        console.log("loading player")
        youtubePlayer = new YT.Player('youtube-player', {
            events: {
                'onStateChange': onYoutubePlayerStateChange
            }
        });
    }

    function onYoutubePlayerStateChange(event) {
        console.log("WE ARE HERE BOYS")
        console.log(event.data)
        if (event.data == YT.PlayerState.ENDED) {
            nextTrack();  // Move to the next track when the video ends
        }
    }

    // SoundCloud API handling
    function loadSoundCloudPlayer() {
        
        console.log(document.querySelector('iframe'))
        soundcloudWidget = SC.Widget(document.querySelector('iframe'));
        soundcloudWidget.bind(SC.Widget.Events.FINISH, function () {
            nextTrack();  // Move to the next track when the sound finishes
        });
    }
    const fetchData = async () => {
        try {
            const res = await fetch(`${host}/get/songs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
        
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const response = await res.json();
            const url = response[0].url
            generateEmbedUrl(url);
            console.log(response); // Process or use the fetched data here
            queue = response;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const pollingInterval = 3000;
    onMount(async () => {
        fetchData()
        const startPolling = () => {
            // Set the interval to continuously fetch the data
            return setInterval(fetchData, pollingInterval);
        };
        startPolling()
    });
</script>

<!-- HTML and UI -->
<div class="flex flex-col gap-2 mt-4">
    <form 
    class="flex flex-row gap-4"
    on:submit={(e) => {
        const formData = new FormData(e.target)
        const url = formData.get("url")
        addSong(url)
        e.target.reset()
    }}>
        <input
            class="bg-zinc-300 w-full px-2 py-3 rounded-xl"
            name="url"
            type="text"
            placeholder="Enter YouTube or SoundCloud URL"
            />
        <button 
        class="p-3 px-6 rounded-xl hover:border-black hover:border-2 border-2 border-gray-300 font-bold"
        type="submit">Send</button>

    </form>
    <!-- Display the embedded player if a valid URL is detected -->
    {#if embedUrl}
        <div class="my-2">
            {#if embedType === 'youtube'}
                <!-- YouTube iframe with ID for API -->
                <iframe
                    id="youtube-player"
                    src={embedUrl}
                    allow="autoplay; encrypted-media"
                    allowfullscreen></iframe>
            {:else}
                <!-- Other platforms like SoundCloud or Spotify -->
                <iframe
                    src={embedUrl}
                    allow="autoplay; encrypted-media"
                    allowfullscreen></iframe>
            {/if}
        </div>
    {/if}

    <div>
        <button
            class="text-white border-2 border-gray-300 rounded text-black px-2 py-1"
            on:click={() => {
                nextTrack(queue, currentTrack);
            }}
        >
        skip
        </button>
    </div>

    <div class="border border-gray-300 p-4 rounded-xl">
        <h2 class="font-bold text-xl">
            Queue
        </h2>
        {#each queue as song}
            <div class="mt-2 bg-gray-300 p-2 text-black font-bold rounded-xl">{song.url.slice(0, 30)}...</div>
        {/each}
    </div>
</div>
