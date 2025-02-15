<script lang="ts">
    import Header from "$lib/components/Header.svelte";

    let name = '';
    let image: FileList | null = null;

    export let data: any;
    const user = data.user;

    const createCharacter = async () => {
        //disable all inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });

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
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = `/${user.name}/${name}`
        } else {
            alert('Failed to create character');
            inputs.forEach(input => {
                input.removeAttribute('disabled');
            });
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

<Header />

<div class="flex justify-center p-6">
    <div class="flex flex-col p-6">
        <h1 class="text-2xl font-bold pb-4">Create character</h1>

        <label for="name">Name</label>
        <input type="text" id="name" placeholder="Name" bind:value={name} class="p-2 border border-gray-300 rounded mb-4 w-52" />

        <label for="image">Image</label>
        <input type="file" id="image" bind:files={image} class="p-2 border border-gray-300 rounded mb-4 w-52" on:change={displayImage} />
        <img src="" alt="" id="display" class="mb-4 h-52 w-52 object-contain" />

        <button on:click={createCharacter} class="bg-blue-900 hover:bg-blue-600 rounded p-2 w-52">Create</button>
    </div>
</div>
