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
	import TextField from '@awenovations/aura/text-field.svelte';

	let { data, children } = $props();

	let settingsOpen = $state(false);

	let personalInfoFormLoading = $state(false);

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

	const updatePersonalInformation = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		personalInfoFormLoading = true;

		const formData = [...new FormData(event.currentTarget).entries()].reduce(
			(accumulator, value) => ({
				...accumulator,
				[value[0]]: value[1]
			}),
			{}
		);

		const result = await fetch(`/api/user/${data?.session?.user?._id}`, {
			method: 'PATCH',
			body: JSON.stringify(formData)
		});

		if (result.ok) {
			showToast({
				severity: 'success',
				message: 'Personal information updated!'
			});
		} else {
			const response = await result.json();
			showToast({
				severity: 'error',
				message: response.message
			});
		}

		personalInfoFormLoading = false;
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
			<div class="right-user-actions">
				<Button
					onclick={() => goto('/signout')}
					kind="outlined"
					variant="secondary"
					size="small"
					data-cy="sign-out"
					class="sign-out">Sign out</Button
				>
				<Tooltip content="Accout Settings" placement="bottom-end">
					<Link onclick={toggleSettings}>
						<Icon name="settings" size="large" />
					</Link>
				</Tooltip>
			</div>
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

	<Panel width="25vw" open={settingsOpen} class="settings-panel">
		<div class="settings-wrapper">
			<h2>
				Settings
				<Button size="small" onclick={toggleSettings}>Close</Button>
			</h2>
			<form onsubmit={updatePersonalInformation}>
				<h3>Personal Information</h3>
				<TextField name="name" value={data?.session?.user?.name}>
					<span slot="label">Name</span>
				</TextField>
				<Tooltip
					placement="bottom"
					content={data?.session?.user?.authProvider !== 'board-buddy'
						? `You are logged in using your ${data?.session?.user?.authProvider} account.`
						: `Contact us if you'd like to change your email.`}
				>
					<TextField name="email" value={data?.session?.user?.email} disabled>
						<span slot="label">Email</span>
					</TextField>
				</Tooltip>
				<Button bind:loading={personalInfoFormLoading} kind="outlined">Update</Button>
			</form>
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
		&,
		form {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

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

	.logo {
		color: var(--aura-light-secondary-40);
		display: flex;
		flex-direction: column;

		.name {
			font: var(--aura-display2);
		}

		.center & {
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
