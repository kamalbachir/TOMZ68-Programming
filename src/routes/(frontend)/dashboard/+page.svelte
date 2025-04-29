<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import type { Pet, SafeUser } from '$lib/types';
	import { goto } from '$app/navigation';

	let pets: Pet[] = [];
	let error = '';
	let success = '';

	$: user = $currentUser;

	async function loadPets() {
		if (!user) {
			goto('/login');
			return;
		}

		const res = await fetch('/api/pets');
		if (res.ok) {
			const allPets = await res.json();
			pets = allPets.filter((pet: Pet) => pet.owner === user.id);
		} else {
			error = 'Failed to load pets';
		}
	}

	async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
		if (!user) {
			error = 'You need to be logged in to perform this action';
			goto('/login');
			return;
		}

		const res = await fetch('/api/actions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: user.id,
				petId,
				action
			})
		});

		if (res.ok) {
			success = `Pet successfully ${action === 'return' ? 'returned' : action + 'ed'}`;
			loadPets();
		} else {
			const errorText = await res.text();
			error = `Failed to ${action} pet: ${errorText}`;
		}
	}

	onMount(() => {
		if (!user) {
			goto('/login');
		} else {
			loadPets();
		}
	});
</script>

<div class="container">
	<h1>📋 Your Adopted Pets</h1>

	{#if success}<p class="message success">{success}</p>{/if}
	{#if error}<p class="message error">{error}</p>{/if}

	{#if pets.length === 0}
		<p>You haven't adopted any pets yet.</p>
	{:else}
		<ul class="pet-list">
			{#each pets as pet}
				<li>
					<h3>{pet.name} ({pet.type})</h3>
					<div>Happiness: {pet.happiness}/100</div>
					<div>Hunger: {pet.hunger}/100</div>
					<div class="actions">
						<button on:click={() => handleAction(pet.id, 'feed')}>Feed</button>
						<button on:click={() => handleAction(pet.id, 'toy')}>Play</button>
						<button on:click={() => handleAction(pet.id, 'return')}>Return</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.pet-list {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.pet-list li {
		background-color: #fff;
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 6px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: none;
		border-radius: 5px;
		background-color: #4caf50;
		color: white;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #45a049;
	}

	.message {
		font-weight: bold;
		margin: 1rem 0;
	}

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>
