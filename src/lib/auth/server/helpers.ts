import { goto } from '$app/navigation';
import { showToast } from '@awenovations/aura/toast.store';

export const submitUserEvent = async (formData: FormData) => {
	try {
		const response = await fetch('/signup/account', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			showToast({
				severity: 'success',
				message: 'Account successfully created!'
			});

			goto('/signin');
		} else {
			throw Error((await response.json()).message);
		}
	} catch (error) {
		console.log(error);

		showToast({
			severity: 'error',
			message: (error as { message: string }).message
		});
	}
};
