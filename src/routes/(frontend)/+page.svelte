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

<!-- HTML Layout -->
<div class="container">
	<h1>Pet Shop</h1>

	{#if user}
		<p><strong>Your Budget:</strong> ${user.budget}</p>
		<p><strong>Inventory:</strong></p>
		<ul>
			<li>Food: {user.inventory.food}</li>
			<li>Toy: {user.inventory.toy}</li>
			<li>Treat: {user.inventory.treat}</li>
		</ul>

		<div class="button-group">
			<button on:click={() => buy('food')}>Buy Food (${prices.food})</button>
			<button on:click={() => buy('toy')}>Buy Toy (${prices.toy})</button>
			<button on:click={() => buy('treat')}>Buy Treat (${prices.treat})</button>
		</div>
	{:else}
		<p>Please log in to purchase items.</p>
	{/if}

	<p class="message">{message}</p>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		margin: 0.5rem;
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

	.button-group {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.message {
		margin-top: 1rem;
		color: #333;
		font-weight: bold;
	}
</style>

