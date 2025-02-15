<script lang="ts">
    function logout() {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/';
    }
</script>

<div class="flex flex-row justify-between items-center p-4 bg-gray-800 text-white">
    <h1>Refsheet.page</h1>
    <a href="/dashboard" class="hover:underline">My characters</a>
    <button on:click={logout} class="bg-blue-900 hover:bg-blue-600 rounded p-2">Log out</button>
</div>
