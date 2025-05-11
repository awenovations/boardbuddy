<script lang="ts">
	import Button from '@awenovations/aura/button.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import { showToast } from '@awenovations/aura/toast.store';
	import TextField from '@awenovations/aura/text-field.svelte';

	let { user } = $props();

	let personalInfoFormLoading = $state(false);

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

		const result = await fetch(`/api/user/${user?._id}`, {
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

<form onsubmit={updatePersonalInformation}>
	<h3>Personal Information</h3>
	<TextField name="name" value={user?.name}>
		<span slot="label">Name</span>
	</TextField>
	<Tooltip
		placement="bottom"
		content={user?.authProvider !== 'board-buddy'
			? `You are logged in using your ${user?.authProvider} account.`
			: `Contact us if you'd like to change your email.`}
	>
		<TextField name="email" value={user?.email} disabled>
			<span slot="label">Email</span>
		</TextField>
	</Tooltip>
	<Button bind:loading={personalInfoFormLoading} kind="outlined">Update</Button>
</form>

<style lang="scss">
  form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
