<script lang="ts">
	import { currentUser } from '$lib/stores';

	let user = $currentUser;
	let message = '';

	const prices = {
		food: 10,
		toy: 15,
		treat: 5
	};

	async function buy(item: 'food' | 'toy' | 'treat') {
		if (!user) {
			message = 'Please login to buy items.';
			return;
		}

		const res = await fetch('/api/shop', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: user.id, item, cost: prices[item] })
		});

		if (res.ok) {
			message = `${item} purchased!`;
			user.budget -= prices[item];
			user.inventory[item] = (user.inventory[item] || 0) + 1;
		} else {
			message = await res.text();
		}
	}
</script>

<h1>Pet Shop</h1>

{#if user}
	x
	<p>Inventory: 🥩 {user.inventory.food} 🎾 {user.inventory.toy} 🍬 {user.inventory.treat}</p>
	<button on:click={() => buy('food')}>Buy Food - ${prices.food}</button>
	<button on:click={() => buy('toy')}>Buy Toy - ${prices.toy}</button>
	<button on:click={() => buy('treat')}>Buy Treat - ${prices.treat}</button>
{:else}
	<p>Please login to see your budget and inventory.</p>
{/if}

<p>{message}</p>

<style>
	button {
		padding: 0.5rem;
		font-size: 1rem;
	}
</style>
