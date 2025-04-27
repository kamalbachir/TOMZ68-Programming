<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';

    let name = '';
    let password = '';
    let error = '';

    async function handleLogin() {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        });

        if (res.ok) {
            const user = await res.json();
            currentUser.set(user);
            goto('/dashboard');
        } else {
            const errorText = await res.text();
            error = errorText || 'Login failed. Please check your credentials.';
        }
    }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleLogin}>
    <div>
        <label for="name">Username</label>
        <input id="name" type="text" bind:value={name} required />
    </div>
    <div>
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required />
    </div>
    <button type="submit">Login</button>

    {#if error}
        <p style="color: red;">{error}</p>
    {/if}

    <p>
        Don't have an account? <a href="/register">Register here</a>.
    </p>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 300px;
    }

    input {
        padding: 0.5rem;
        width: 100%;
    }
</style>