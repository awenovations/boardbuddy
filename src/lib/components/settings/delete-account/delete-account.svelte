<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@awenovations/aura/button.svelte';
	import { openDialog } from '$lib/stores/dialog.store';

	let { user } = $props();

	let loading = $state(false);

	const deleteAccount = async () => {
		console.log('This is a thing');

		loading = true;

		const response = await Promise.all([
			fetch(`/api/user/${user._id}/tasks`, {
				method: 'DELETE'
			}),

			await fetch(`/api/user/${user._id}`, {
				method: 'DELETE'
			})
		]);

		goto('/signin');

		loading = false;
	};

	const click = () => {
		openDialog({
			message: 'Are you sure you want to delete your account?',
			confirmText: 'Delete',
			handleConfirm: deleteAccount
		});
	};
</script>

<h4>Delete Account</h4>

Deleting your account is permanent and cannot be undone. All data will be lost.

<Button {loading} variant="tertiary" kind="outlined" onclick={click}>Delete Account</Button>
