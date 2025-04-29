<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';

    let name = 'New Pet';
    let type = 'puppy';
    let error = '';
    let success = '';

    $: user = $currentUser;

    onMount(() => {
        if (!user) {
            goto('/login');
            return;
        }

        if (!user.isAdmin) {
            goto('/');
            return;
        }
    });

    async function addPet() {
        if (!user || !user.isAdmin) {
            error = 'You need admin permission to add pets';
            return;
        }

        const pet = {
            id: Date.now(),
            name,
            type,
            hunger: 50,
            happiness: 50,
            adoptionStatus: false,
            owner: null
        };

        const res = await fetch('/api/pets', {
            method: 'POST',
            body: JSON.stringify(pet),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            success = '🔥 Pet added successfully!';
            name = 'New Pet';
            type = 'puppy';
            error = '';
        } else {
            const errorText = await res.text();
            error = errorText || '❌ Failed to add pet';
            success = '';
        }
    }
</script>

<div class="admin-panel">
    <h1>🚨 Admin Panel</h1>
    <p class="subtitle">Add a new pet to the system</p>

    {#if success}<p class="success">{success}</p>{/if}
    {#if error}<p class="error">{error}</p>{/if}

    <form on:submit|preventDefault={addPet}>
        <div class="form-group">
            <label for="name">🐾 Pet Name</label>
            <input id="name" type="text" bind:value={name} required />
        </div>

        <div class="form-group">
            <label for="type">📦 Pet Type</label>
            <select id="type" bind:value={type}>
                <option value="puppy">Puppy</option>
                <option value="kitten">Kitten</option>
            </select>
        </div>

        <button type="submit">➕ Add Pet</button>
    </form>
</div>

<style>
    .admin-panel {
        max-width: 500px;
        margin: 3rem auto;
        padding: 2rem;
        background-color: #fff5f5;
        border: 2px solid #f44336;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
        text-align: center;
    }

    h1 {
        color: #b71c1c;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #d32f2f;
        margin-bottom: 2rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.2rem;
        text-align: left;
    }

    label {
        font-weight: bold;
        color: #c62828;
        margin-bottom: 0.4rem;
    }

    input, select {
        padding: 0.6rem;
        border: 1px solid #ef9a9a;
        border-radius: 6px;
        font-size: 1rem;
    }

    button {
        background-color: #e53935;
        color: white;
        border: none;
        padding: 0.8rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #c62828;
    }

    .success {
        color: #2e7d32;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .error {
        color: #d32f2f;
        font-weight: bold;
        margin-bottom: 1rem;
    }
</style>
