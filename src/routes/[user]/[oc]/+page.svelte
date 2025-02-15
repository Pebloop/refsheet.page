<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const user = data.user;
    const oc = data.oc;
    const loggedInUser = data.loggedInUser;
    const ocData = data.ocData;
</script>

{#if ocData !== null}
    {#if loggedInUser && user === loggedInUser.name}
        <div class="flex flex-row justify-end items-center p-4 text-white">
            <a class="bg-blue-900 hover:bg-blue-600 rounded p-2" href="/{user}/{oc}/edit">Edit</a>
        </div>
    {/if}

    <div class="flex flex-col items-center p-6">
        <h1 class="text-4xl font-bold pb-8">{ocData?.name}</h1>
        <img src={ocData?.image} alt="" class="mb-4 h-1/3 w-1/3 object-contain max-md:w-3/4" />

        <div class="flex flex-col items-center mt-10 bg-gray-700 p-6 rounded-2xl">
            <h2 class="text-2xl font-bold pb-4">Gallery</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each ocData.gallery as image}
                    <img src={image} alt="" class="w-52 h-52 object-contain" />
                {/each}
            </div>
        </div>
    </div>

{:else}

    <div class="flex flex-col items-center justify-center p-6 h-screen">
        <h1 class="text-2xl font-bold pb-4">Character not found</h1>
    </div>

{/if}
