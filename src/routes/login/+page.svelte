<script lang="ts">

    let email: string = '';
    let code: string = '';
    async function loginOrRegister() {
        const login = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email}),
        })

        const result = await login.json();
        console.log(result);

        const emailInput = document.getElementById('email-input') as HTMLInputElement;
        emailInput.disabled = true;

        const loginButton = document.getElementById('login-button') as HTMLButtonElement;
        loginButton.hidden = true;

        const codeInput = document.getElementById('code-input') as HTMLInputElement;
        codeInput.hidden = false;

        const codeButton = document.getElementById('code-button') as HTMLButtonElement;
        codeButton.hidden = false;
    }

    async function verifyCode() {
        const login = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, code}),
        })

        const result = await login.json();
        console.log(result);

        // store token in cookie
        if (result.success) {
            document.cookie = `token=${result.token}; path=/`;
            window.location.href = '/' + result.user;
        }

    }
</script>

<div class="flex flex-col items-center justify-center h-screen w-full text-center">
    <div class="bg-gray-900 text-white dark:bg-gray-300 dark:text-gray-900 rounded-2xl p-6">
        <div>
            <h1 class="text-4xl">Refsheet.page</h1>
            <h2>A simple page for your characters</h2>
        </div>
        <div class="mt-8 flex flex-col">
            <input id="email-input" type="text" class="p-2 bg-gray-900 text-white dark:bg-white rounded-2xl dark:text-black m-4" placeholder="email" bind:value={email} />
            <input id="code-input" type="text" class="p-2 bg-gray-900 text-white dark:bg-white rounded-2xl dark:text-black m-4" placeholder="code" hidden bind:value={code} />
            <button id="login-button" on:click={loginOrRegister} class="p-2 bg-gray-900 text-white dark:bg-white rounded-2xl dark:text-black m-4">Continue</button>
            <button id="code-button" on:click={verifyCode} class="p-2 bg-gray-900 text-white dark:bg-white rounded-2xl dark:text-black m-4" hidden>Verify</button>
        </div>
    </div>
</div>
