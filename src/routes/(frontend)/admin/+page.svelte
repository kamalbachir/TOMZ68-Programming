<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import { goto } from '$app/navigation';

	let name = 'New Pet';
	let type = 'puppy';
	let error = '';
	let success = '';

	$: user = $currentUser;

	onMount(() => {x
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
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			success = 'Pet added successfully!';
			name = 'New Pet'; // Reset form
			type = 'puppy';
		} else {
			const errorText = await res.text();
			error = errorText || 'Failed to add pet';
		}
	}
</script>

<h1>Add a New Pet</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

<form on:submit|preventDefault={addPet}>
	<div>
		<label for="name">Pet Name</label>
		<input id="name" type="text" bind:value={name} required />
	</div>

	<div>
		<label for="type">Pet Type</label>
		<select id="type" bind:value={type}>
			<option value="puppy">Puppy</option>
			<option value="kitten">Kitten</option>
		</select>
	</div>

	<button type="submit">Add Pet</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	input, select {
		padding: 0.5rem;
		width: 100%;
	}
</style>
