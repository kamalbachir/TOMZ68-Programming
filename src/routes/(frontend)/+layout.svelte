<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';

    $: user = $currentUser;

    function logout() {
        currentUser.set(null);
        goto('/login');
    }
</script>

<nav>
    <a href="/">Home</a>
    {#if user}
        <a href="/dashboard">Dashboard</a>
        <a href="/logs">Logs</a>
        <a href="/shop">Shop</a>
        <a href="/pets">Adopt</a>
        {#if user.isAdmin}
            <a href="/admin">Admin Panel</a>
        {/if}
        <button on:click={logout}>Logout</button>
        <span class="user">{user.name}</span>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}
</nav>

<slot />

<style>
    nav {
        background: #f2f2f2;
        padding: 1rem;
        display: flex;
        justify-content: center; /* Center items horizontally */
        align-items: center; /* Center items vertically */
        gap: 1rem;
        border-bottom: 1px solid #ccc;
    }

    nav a {
        text-decoration: none;
        color: #333;
    }

    nav .user {
        margin-left: auto;
        font-weight: bold;
    }

    nav button {
        background: transparent;
        border: none;
        cursor: pointer;
        color: #0077cc;
    }

    nav button:hover {
        color: #005fa3;
    }
</style>
