<script lang="ts">
	import Link from '@awenovations/aura/link.svelte';
	import Icon from '@awenovations/aura/icon.svelte';
	import Alert from '@awenovations/aura/alert.svelte';
	import Panel from '@awenovations/aura/panel.svelte';
	import Dialog from '@awenovations/aura/dialog.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import { dialogStore } from '$lib/stores/dialog.store';

	import PersonalInfo from '$lib/components/settings/personal-info/personal-info.svelte';
	import DeleteAccount from '$lib/components/settings/delete-account/delete-account.svelte';
	import AccountManagement from '$lib/components/settings/account-management/account-management.svelte';

	let { data, children } = $props();

	let settingsOpen = $state(false);

	const toggleSettings = () => {
		settingsOpen = !settingsOpen;
	};

	const handleEscapeKeydown = (event) => {
		if (event.key === 'Escape') {
			settingsOpen = false;
		}
	};
</script>

<svelte:window onkeydown={handleEscapeKeydown} />

<div class="wrapper">
	<header>
		<div class="logo">
			<span class="name">Board Buddy</span>
			Simplify Your Workflow
		</div>

		<Alert>Alpha version - features may be unstable. Thanks for trying!</Alert>

		<form method="POST" action="/signout">
			<div class="right-user-actions">
				<Button
					type="submit"
					kind="outlined"
					variant="secondary"
					size="small"
					data-cy="sign-out"
					class="sign-out">Sign out</Button
				>
				<Tooltip content="Account Settings" placement="bottom-end">
					<Link onclick={toggleSettings}>
						<Icon name="settings" size="large" />
					</Link>
				</Tooltip>
			</div>
		</form>
	</header>

	{@render children?.()}
</div>

{#if data?.session?.user}
	{#if $dialogStore.open}
		<Dialog
			class="floating-dialog"
			confirmText={$dialogStore.confirmText}
			cancelText={$dialogStore.cancelText}
			onCancel={$dialogStore.handleCancel}
			onConfirm={$dialogStore.handleConfirm}>{$dialogStore.message}</Dialog
		>
		<div class="backdrop"></div>
	{/if}

	<Panel width="19vw" open={settingsOpen} class="settings-panel">
		<div class="settings-wrapper">
			<h2>
				Settings
				<Button size="small" onclick={toggleSettings}>Close</Button>
			</h2>
			<PersonalInfo user={data?.session?.user} />
			<AccountManagement user={data?.session?.user} />
			<DeleteAccount user={data?.session?.user} />
		</div>
	</Panel>
{/if}

<footer>
	&copy; {new Date().getFullYear()} Benjamin Knox | Feedback:&nbsp;<Link
		href="mailto:ben@knoxes.email">ben@knoxes.email</Link
	>&nbsp;| My Website:&nbsp;<Link target="blank" href="https://knox.pro">knox.pro</Link>
</footer>

<style lang="scss">
	:global(.settings-panel) {
		z-index: 1000;
		max-width: 25.714rem;
	}

	.settings-wrapper {
		padding: 1.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: var(--width);
		white-space: normal;

		:global(.aura-button .content) {
			justify-content: center;
		}

		h2 {
			display: flex;
			justify-content: space-between;
		}
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		padding: 1.875rem 0 4.018rem;
		box-sizing: border-box;
		margin: 0 auto;
		min-width: 71.429rem;
		width: fit-content;
		max-height: 100%;
		gap: 1rem;
		overflow: hidden;
		background: var(--aura-background);
		font: var(--aura-default-regular);
		color: var(--aura-font-color);
		height: 100%;

		header {
			display: flex;
			align-items: self-start;
			justify-content: space-between;
		}
	}

	.right-user-actions {
		display: flex;
		gap: 1.406rem;
		align-items: center;
	}

	:global(.sign-out) {
		margin-right: 0.071rem;
	}

	:global(.logo) {
		color: var(--aura-light-secondary-40);
		display: flex;
		flex-direction: column;

		:global(.name) {
			font: var(--aura-display2);
		}
	}

	:global(.floating-dialog) {
		position: absolute;
		top: 43%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1001;
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 40%);
		backdrop-filter: blur(0.2rem);
		height: 100%;
		width: 100%;
		z-index: 1000;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: var(--aura-background);
		height: 2.143rem;
		z-index: 1000;
		font-size: 8pt;
		border-top: 1px solid var(--aura-container-border-color);
		box-sizing: border-box;

		& :global(a.aura-link:active) {
			font-size: 8pt;
		}
	}
</style>
