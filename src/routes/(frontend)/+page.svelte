<script lang="ts">
	import { currentUser } from '$lib/stores';

	$: user = $currentUser;
	const prices = { food: 4, toy: 20, treat: 7 };
	let message = '';

	async function buy(item: 'food' | 'toy' | 'treat') {
		if (!user) {
			message = 'Please log in to buy items.';
			return;
		}

		const res = await fetch('/api/shop', {
			method: 'POST',
			body: JSON.stringify({
				userId: user.id,
				item,
				cost: prices[item]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			message = `Successfully purchased ${item}`;
			user.budget -= prices[item];
			user.inventory[item] = (user.inventory[item] || 0) + 1;
		} else {
			message = await res.text();
		}
	}
</script>

<h1>Pet Shop</h1>

{#if user}
	<p>Your Budget: ${user.budget}</p>
	<p>Inventory:</p>
	<ul>
		<li>Food: {user.inventory.food}</li>
		<li>Toy: {user.inventory.toy}</li>
		<li>Treat: {user.inventory.treat}</li>
	</ul>
	<button on:click={() => buy('food')}>Buy Food (${prices.food})</button>
	<button on:click={() => buy('toy')}>Buy Toy (${prices.toy})</button>
	<button on:click={() => buy('treat')}>Buy Treat (${prices.treat})</button>
{:else}
	<p>Please log in to purchase items.</p>
{/if}

<p>{message}</p>

<style>
	button {
		padding: 0.5rem;
		font-size: 1rem;
		margin-right: 0.5rem;
	}
</style>
