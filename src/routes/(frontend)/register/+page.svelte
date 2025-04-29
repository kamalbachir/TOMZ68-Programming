<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';

    let name = '';
    let email = '';
    let password = '';
    let error = '';

    async function handleRegister() {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (res.ok) {
                const user = await res.json();
                currentUser.set(user);
                goto('/dashboard');
            } else {
                const errorText = await res.text();
                error = errorText || 'Registration failed. Try again.';
            }
        } catch (e) {
            error = 'Network error. Please check your connection.';
            console.error(e);
        }
    }
</script>

<div class="form-container">
    <h1>Register</h1>

    <form on:submit|preventDefault={handleRegister}>
        <input type="text" bind:value={name} placeholder="Name" required />
        <input type="email" bind:value={email} placeholder="Email" required />
        <input type="password" bind:value={password} placeholder="Password" required />
        <button type="submit">Register</button>

        {#if error}
            <p class="error">{error}</p>
        {/if}
    </form>
</div>

<style>
    .form-container {
        max-width: 400px;
        margin: 3rem auto;
        padding: 2rem;
        background-color: #f0fff4;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.1);
        text-align: center;
    }

    h1 {
        color: #2e7d32;
        margin-bottom: 1.5rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.7rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    button {
        padding: 0.7rem;
        font-size: 1rem;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #388e3c;
    }

    .error {
        color: red;
        font-weight: bold;
    }
</style>
