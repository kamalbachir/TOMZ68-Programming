<script lang="ts">
    import { currentUser } from '$lib/stores';

    $: user = $currentUser;
    const prices = { food: 10, toy: 15, treat: 5 };
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

<div class="container">
    <h1>Pet Shop</h1>

    {#if user}
        <p class="budget">💰 Budget: <strong>${user.budget}</strong></p>

        <div class="inventory">
            <p>📦 Inventory:</p>
            <div class="items">
                <div><span class="emoji">🥩</span> {user.inventory.food}</div>
                <div><span class="emoji">🎾</span> {user.inventory.toy}</div>
                <div><span class="emoji">🍬</span> {user.inventory.treat}</div>
            </div>
        </div>

        <div class="button-group">
            <button on:click={() => buy('food')}>Buy Food - $10</button>
            <button on:click={() => buy('toy')}>Buy Toy - $15</button>
            <button on:click={() => buy('treat')}>Buy Treat - $5</button>
        </div>
    {:else}
        <p>Please log in to purchase items.</p>
    {/if}

    <p class="message">{message}</p>
</div>

<style>
    .container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        text-align: center;
        background-color: #f0fff4;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
    }

    h1 {
        font-size: 2rem;
        color: #2e7d32;
    }

    .budget {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .inventory {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .items {
        display: flex;
        justify-content: center;
        gap: 2rem;
        font-size: 1.4rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }

    .emoji {
        margin-right: 0.3rem;
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }

    button {
        padding: 0.7rem 1.2rem;
        font-size: 1rem;
        border: none;
        border-radius: 6px;
        background-color: #4caf50;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #388e3c;
    }

    .message {
        margin-top: 1rem;
        color: #2e7d32;
        font-weight: bold;
    }
</style>
