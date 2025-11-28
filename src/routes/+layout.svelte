<script lang="ts">
	import 'reset-css/reset.css';
	import classNames from 'classnames';
	import { goto } from '$app/navigation';
	import Link from '@awenovations/aura/link.svelte';
	import Icon from '@awenovations/aura/icon.svelte';
	import Panel from '@awenovations/aura/panel.svelte';
	import Toast from '@awenovations/aura/toast.svelte';
	import Dialog from '@awenovations/aura/dialog.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import '@awenovations/aura/dist/tokens/_variables.css';
	import { dialogStore } from '$lib/stores/dialog.store';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	import PersonalInfo from '$lib/components/settings/personal-info/personal-info.svelte';
	import DeleteAccount from '$lib/components/settings/delete-account/delete-account.svelte';
	import AccountManagement from '$lib/components/settings/account-management/account-management.svelte';

	let { data, children } = $props();

	let settingsOpen = $state(false);

	$effect(() => {
		if (data.errorMessage) {
			showToast({
				severity: 'error',
				message: data.errorMessage
			});
		}
	});

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

<div class={classNames('wrapper', { center: !data.session })}>
	<header>
		<div class="logo">
			<span class="name">Board Buddy</span>
			Simplify Your Workflow
		</div>

		{#if data.session}
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
		{/if}
	</header>

	{@render children?.()}
</div>
<Toast />
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

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

	:global(.hidden-sign-in-form),
	:global(.hidden-sign-up-form) {
		display: none;
	}

	:global(html, body) {
		width: 100%;
		overflow: clip;
	}

	:global(html, body),
	.wrapper {
		background: var(--aura-background);
		font: var(--aura-default-regular);
		color: var(--aura-font-color);
		height: 100%;
	}

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
		padding: 1.875rem 0;
		box-sizing: border-box;
		margin: 0 auto;
		min-width: 71.429rem;
		width: fit-content;
		max-height: 100%;
		gap: 3.813rem;
		overflow: hidden;

		&.center {
			gap: 0.714rem;
		}

		&:not(.center) header {
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

		:global(.center) & {
			align-items: center;
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
</style>
