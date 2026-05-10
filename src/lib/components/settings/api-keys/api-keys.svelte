<script lang="ts">
	import Button from '@awenovations/aura/button.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	let { user } = $props();

	interface ApiKey {
		_id: string;
		name: string;
		created_at: number;
		last_used: number | null;
	}

	let keys = $state<ApiKey[]>([]);
	let loading = $state(true);
	let newKeyName = $state('');
	let creating = $state(false);
	let newlyCreatedKey = $state<string | null>(null);
	let copied = $state(false);

	const loadKeys = async () => {
		loading = true;
		const res = await fetch(`/api/user/${user._id}/api-keys`);
		if (res.ok) keys = await res.json();
		loading = false;
	};

	$effect(() => {
		loadKeys();
	});

	const createKey = async () => {
		if (!newKeyName.trim()) return;
		creating = true;

		const res = await fetch(`/api/user/${user._id}/api-keys`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: newKeyName.trim() })
		});

		if (res.ok) {
			const data = await res.json();
			newlyCreatedKey = data.key;
			newKeyName = '';
			await loadKeys();
		} else {
			showToast({ severity: 'error', message: 'Failed to create API key' });
		}

		creating = false;
	};

	const revokeKey = async (keyId: string) => {
		const res = await fetch(`/api/user/${user._id}/api-keys`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key_id: keyId })
		});

		if (res.ok) {
			keys = keys.filter((k) => k._id !== keyId);
			showToast({ severity: 'success', message: 'API key revoked' });
		} else {
			showToast({ severity: 'error', message: 'Failed to revoke key' });
		}
	};

	const copyKey = async () => {
		if (!newlyCreatedKey) return;
		await navigator.clipboard.writeText(newlyCreatedKey);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	};

	const formatDate = (ts: number) =>
		new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
</script>

<div class="api-keys">
	<h3>MCP API Keys</h3>

	{#if newlyCreatedKey}
		<div class="new-key-banner">
			<span class="new-key-label">Copy your key — it won't be shown again</span>
			<div class="new-key-row">
				<code class="key-value">{newlyCreatedKey}</code>
				<Button size="small" kind="outlined" onclick={copyKey}>
					{copied ? 'Copied!' : 'Copy'}
				</Button>
			</div>
			<Button size="small" variant="secondary" onclick={() => (newlyCreatedKey = null)}>
				Done
			</Button>
		</div>
	{/if}

	{#if !newlyCreatedKey}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				createKey();
			}}
			class="create-form"
		>
			<TextField
				name="key-name"
				placeholder="Key name (e.g. Claude Desktop)"
				value={newKeyName}
				oninput={(e) => (newKeyName = e.currentTarget.value)}
			>
				{#snippet label()}<span>New key</span>{/snippet}
			</TextField>
			<Button type="submit" loading={creating} kind="outlined" disabled={!newKeyName.trim()}>
				Generate
			</Button>
		</form>
	{/if}

	{#if loading}
		<span class="muted">Loading...</span>
	{:else if keys.length === 0}
		<span class="muted">No API keys yet.</span>
	{:else}
		<ul class="key-list">
			{#each keys as key (key._id)}
				<li>
					<div class="key-info">
						<span class="key-name">{key.name}</span>
						<span class="key-meta">
							Created {formatDate(key.created_at)}
							{#if key.last_used} · Last used {formatDate(key.last_used)}{/if}
						</span>
					</div>
					<Button size="small" kind="outlined" variant="danger" onclick={() => revokeKey(key._id)}>
						Revoke
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.api-keys {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.create-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.new-key-banner {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--aura-success-40) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--aura-success-40) 35%, transparent);
	}

	.new-key-label {
		font: var(--aura-default-regular);
		font-size: 0.75rem;
		color: var(--aura-success-40);
	}

	.new-key-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.key-value {
		flex: 1;
		font-size: 0.7rem;
		font-family: monospace;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--aura-font-color);
		opacity: 0.8;
	}

	.key-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.key-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.key-name {
		font: var(--aura-default-regular);
		font-size: 0.875rem;
	}

	.key-meta {
		font: var(--aura-default-regular);
		font-size: 0.7rem;
		opacity: 0.6;
	}

	.muted {
		font: var(--aura-default-regular);
		font-size: 0.875rem;
		opacity: 0.5;
	}
</style>
