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

<h1>Register</h1>

<form on:submit|preventDefault={handleRegister}>
    <input type="text" bind:value={name} placeholder="Name" required />
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Register</button>
    {#if error}
        <p style="color: red;">{error}</p>
    {/if}
</form>