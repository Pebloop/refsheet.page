<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import {type PageProps} from "./$types";

    let { data }: PageProps = $props();

    const ocs = data.ocs;
    const user = data.user;
    const loggedInUser = data.loggedInUser;

    console.log(ocs);

</script>

{#if user === loggedInUser.name}
    <Header />
{/if}

<div class="flex flex-col p-6 items-center">
    <div class="flex w-3/4 justify-center flex-col">
        <h1 class="text-4xl font-bold pb-8">{user}</h1>

        {#if ocs.length === 0}
            <h2 class="text-2xl font-bold">No characters found</h2>
        {/if}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each ocs as oc}
                <a href={`/${user}/${oc.name}`} class="bg-gray-800 text-white rounded-xl p-4 flex flex-col items-center">
                    <h2 class="text-2xl font-bold">{oc.name}</h2>
                    <img src={oc.image} alt="" class="mt-4 w-full object-contain" />
                </a>
            {/each}

        </div>
    </div>
</div>

{#if user === loggedInUser.name}
    <a href="/new" class="rounded-xl dark:bg-white bg-gray-900 text-white dark:text-gray-900 p-2 fixed bottom-4 right-4">
        Create character
    </a>
{/if}
