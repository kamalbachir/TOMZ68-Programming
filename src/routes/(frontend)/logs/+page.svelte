<script lang="ts">
    import { currentUser } from '$lib/stores';

    $: user = $currentUser;
    let logs = [
        { time: '2025-04-29 10:00', action: 'bought food', username: 'Mohammed' },
        { time: '2025-04-28 15:20', action: 'adopted a pet', username: 'Sarah' },
    ];
</script>

<div class="container">
    <h1>Activity Logs</h1>

    {#if user}
        {#if logs.length > 0}
            <ul>
                {#each logs as log}
                    <li><strong>[{log.time}]</strong> {log.username} {log.action}</li>
                {/each}
            </ul>
        {:else}
            <p>No logs available.</p>
        {/if}
    {:else}
        <p>Please log in to view your logs.</p>
    {/if}
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

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin: 0.5rem 0;
        font-size: 1rem;
    }

    p {
        margin-top: 1rem;
        color: #333;
        font-weight: bold;
    }
</style>
