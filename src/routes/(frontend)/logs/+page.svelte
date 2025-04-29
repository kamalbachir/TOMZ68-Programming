<script lang="ts">
    import { onMount } from 'svelte';
    let logs: string[] = [];
    let error = '';

    onMount(async () => {
        const res = await fetch('/api/log');
        if (res.ok) {
            logs = await res.json();
        } else {
            error = 'Failed to load logs';
        }
    });
</script>
<div class="log-container">
	<h2>Activity Logs</h2>
	{#if logs.length > 0}
		<ul>
			{#each logs as log}
				<li>{log}</li>
			{/each}
		</ul>
	{:else}
		<p>No activity logs available yet.</p>
	{/if}
</div>

<style>
	.log-container {
		padding: 1rem;
		background-color: #f0fdf4;
		border: 1px solid #a3e635;
		border-radius: 8px;
		max-height: 400px;
		overflow-y: auto;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	li {
		color: green;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}
</style>
