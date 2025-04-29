<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import type { Pet, SafeUser } from '$lib/types';
    import { goto } from '$app/navigation';

    let pets: Pet[] = [];
    let filteredPets: Pet[] = [];
    let selectedType = '';
    let error = '';
    let success = '';

    $: user = $currentUser;
    $: filteredPets = selectedType
        ? pets.filter(pet => pet.type === selectedType)
        : pets;

    onMount(() => {
        console.log('Page loaded');
        loadPets();
    });


    async function loadPets() {
        const res = await fetch('/api/pets');
        if (res.ok) {
            pets = await res.json();
            console.log('Loaded pets:', pets);
        } else {
            error = 'Failed to load pets';
            console.error('Failed to load pets');
        }
    }


    async function adoptPet(petId: number) {
        if (!user) {
            goto('/login');
            return;
        }

        const res = await fetch('/api/adopt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, petId })
        });

        if (res.ok) {
            success = 'Pet adopted successfully!';
            loadPets(); // Reload the pets list
        } else {
            const errorText = await res.text();
            error = errorText || 'Failed to adopt pet';
        }
    }
</script>

<h1>Available Pets</h1>


{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

<div>
    <button class:active={selectedType === ''} on:click={() => selectedType = ''}>All</button>
    <button class:active={selectedType === 'puppy'} on:click={() => selectedType = 'puppy'}>Puppies</button>
    <button class:active={selectedType === 'kitten'} on:click={() => selectedType = 'kitten'}>Kittens</button>
</div>

<ul>
    {#each filteredPets as pet}
        <li>
            <h3>{pet.name} ({pet.type})</h3>
            <p>Happiness: {pet.happiness}/100</p>
            <p>Hunger: {pet.hunger}/100</p>
            <p>Status: {pet.owner === null ? 'Available' : 'Adopted'}</p>

            {#if user && !pet.owner}
                <button on:click={() => adoptPet(pet.id)}>Adopt</button>
            {:else}
                <p><i>Already adopted</i></p>
            {/if}

        </li>
    {/each}
</ul>

<style>
    button.active {
        background-color: #0077cc;
        color: white;
    }

    ul {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    li {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 5px;
    }
</style>
