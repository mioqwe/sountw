<script>
    import "../app.css";
    import Header from "$lib/comps/header.svelte";
</script>



<Header />

<main class="container mx-auto max-w-[720px]">
    <slot></slot>
</main>