<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import {onMount} from "svelte";

    export let data: any;
    const user = data.user;
    const oc = data.ocData;

    let name = oc.name;
    let image: FileList | null = null

    onMount(() => {
        const img = document.getElementById('display') as HTMLImageElement;
        img.src = oc.image;
    });

    const updateCharacter = async () => {

        const formData = new FormData();
        const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        const imageFile = image?.item(0);

        if (!token) {
            alert('Not logged in');
            return;
        }

        formData.append('token', token);
        formData.append('name', name);
        formData.append('image', imageFile as Blob);

        const response = await fetch('/api/character', {
            method: 'PATCH',
            body: formData
        });

        if (response.ok) {
            alert('Character updated');
        } else {
            alert('Failed to create character');
        }
    };

    function displayImage() {
        const file = image?.item(0);
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.getElementById('display') as HTMLImageElement;
            img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file as Blob);
    }
</script>

<Header user="{user}" />

<div class="flex justify-center p-6 bg-gray-700 m-12 rounded-2xl">
    <div class="flex flex-col p-6">
        <h1 class="text-2xl font-bold pb-4">Update character</h1>

        <label for="name">Name</label>
        <input type="text" id="name" placeholder="Name" bind:value={name} class="p-2 border border-gray-300 rounded mb-4 w-52" />

        <label for="image">Image</label>
        <input type="file" id="image" bind:files={image} class="p-2 border border-gray-300 rounded mb-4 w-52" on:change={displayImage} />
        <img src="" alt="" id="display" class="mb-4 h-52 w-52 object-contain" />

        <button on:click={updateCharacter} class="bg-blue-900 hover:bg-blue-600 rounded p-2 w-52">Update</button>
    </div>

    <div class="flex flex-col p-6">
        <h1 class="text-2xl font-bold pb-4">Gallery</h1>


    </div>
</div>
