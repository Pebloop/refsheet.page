<script lang="ts">
    import Header from "$lib/components/Header.svelte";

    export let data;

    const ocs = data.ocs;
    console.log(ocs);

</script>

<Header />

<div>
    <h1>Dashboard</h1>

    <div>

    </div>
</div>

<a href="/new" class="rounded-xl dark:bg-white bg-gray-900 text-white dark:text-gray-900 p-2 fixed bottom-4 right-4">
    Create character
</a>
