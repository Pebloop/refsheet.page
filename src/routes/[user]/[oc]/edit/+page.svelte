<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import {onMount} from "svelte";
    import resize from 'resize-image-buffer';

    export let data: any;
    const user = data.user;
    const oc = data.ocData;

    let name = oc.name;
    let image: FileList | null = null
    let newImage: FileList | null = null;

    onMount(() => {
        const img = document.getElementById('display') as HTMLImageElement;
        img.src = oc.image;
    });

    const updateCharacter = async () => {

        const formData = new FormData();
        const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        const imageFile = image?.item(0);

        const imageArrayBuffer = await imageFile?.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer!);
        const imageWidth = 200;
        const imageHeight = imageFile?.size! / imageWidth;
        const resizedImage = await resize(imageBuffer, {width: imageWidth, height: imageHeight});
        const newImage = new File([resizedImage], 'image.png', {type: 'image/png'});


        if (!token) {
            alert('Not logged in');
            return;
        }

        formData.append('token', token);
        formData.append('name', name);
        formData.append('oiginalName', oc.name);
        formData.append('image', newImage as Blob);

        const response = await fetch('/api/character', {
            method: 'PATCH',
            body: formData
        });

        if (response.ok && response.status === 200) {
            alert('Character updated');
        } else {
            alert('Failed to update character');
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

    function displayImageGallery() {
        const file = newImage?.item(0);
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.getElementById('display-gallery') as HTMLImageElement;
            img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file as Blob);
    }

    const addImage = async () => {
        const formData = new FormData();
        const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        const imageFile = newImage?.item(0);

        const imageArrayBuffer = await imageFile?.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer!);
        const imageWidth = 200;
        const imageHeight = imageFile?.size! / imageWidth;
        const resizedImage = await resize(imageBuffer, {width: imageWidth, height: imageHeight});
        const newNewImage = new File([resizedImage], 'image.png', {type: 'image/png'});

        if (!token) {
            alert('Not logged in');
            return;
        }

        formData.append('token', token);
        formData.append('name', name);
        formData.append('image', newNewImage as Blob);

        const response = await fetch('/api/character/gallery', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Image added');
        } else {
            alert('Failed to add image');
        }
    };

    const removeImage = (imageUrl: string) => {
        return async () => {
            const formData = new FormData();
            const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

            if (!token) {
                alert('Not logged in');
                return;
            }

            formData.append('token', token);
            formData.append('name', name);
            formData.append('image', imageUrl);

            const response = await fetch('/api/character/gallery', {
                method: 'DELETE',
                body: formData
            });

            if (response.ok) {
                alert('Image removed');
            } else {
                alert('Failed to remove image');
            }
        };
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

</div>

<div class="flex justify-center p-6 bg-gray-700 m-12 rounded-2xl">
    <div class="flex flex-col p-6">
        <h1 class="text-2xl font-bold pb-4 self-center">Gallery</h1>

        <div class="flex flex-col items-center">
            <input type="file" id="gallery" bind:files={newImage} class="p-2 border border-gray-300 rounded mb-4 w-52" on:change={displayImageGallery} />
            <img src="" alt="" id="display-gallery" class="mb-4 h-52 w-52 object-contain" />
            <button class="bg-blue-900 hover:bg-blue-600 rounded p-2 w-52" on:click={addImage}>Add</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {#each oc.gallery as gimage}
                <div class="bg-gray-800 text-white rounded-xl p-4 flex flex-col items-center">
                    <img src={gimage} alt="" class="w-52 h-52 object-contain" />
                    <button class="bg-red-900 hover:bg-red-600 rounded p-2 w-52 mt-4" on:click={removeImage(gimage)}>Remove</button>
                </div>
            {/each}
        </div>
    </div>
</div>
