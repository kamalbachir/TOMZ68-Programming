<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="home-container">
    <h1>🐾 Welcome to TOMZ68 Pet Portal! </h1>
    <p>Your cozy place for adopting, caring, and shopping for your virtual pets! </p>
    <p>Made By M.Kamal Bachir </p>

    <div class="nav-buttons">
        <button on:click={() => goto('/shop')}>🛍️ Go to Shop</button>
        <button on:click={() => goto('/logs')}>📜 View Logs</button>
    </div>
</div>

<style>
    .home-container {
        max-width: 700px;
        margin: 4rem auto;
        padding: 2rem;
        text-align: center;
        background-color: #fffef6;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #4caf50;
    }

    p {
        font-size: 1.2rem;
        color: #444;
        margin-bottom: 2rem;
    }

    .nav-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 0.8rem 1.4rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #388e3c;
    }
</style>
