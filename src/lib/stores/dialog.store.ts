import { writable, type Writable } from 'svelte/store';

export interface DialogState {
	open: boolean;
	message: string;
  cancelText: string;
  confirmText: string;
	handleCancel: () => void;
	handleConfirm: () => void;
}

export const defaultDialog: DialogState = {
	open: false,
	message: 'Are you sure you wish to perform this action',
  cancelText: 'Cancel',
  confirmText: 'Confirm',
	handleCancel: () => {},
	handleConfirm: () => {}
};

export const dialogStore: Writable<DialogState> = writable(defaultDialog);

export const openDialog = (dialog: Partial<DialogState>) => {
	const { handleConfirm, handleCancel, ...dialogForUse } = dialog ?? {};
	dialogStore.set({
		...defaultDialog,
		...dialogForUse,
    open: true,
		handleCancel: (...args) => {
			handleCancel?.(...args);
			closeDialog();
		},
		handleConfirm: (...args) => {
			handleConfirm?.(...args);
			closeDialog();
		}
	});
};

export const closeDialog = () => {
	dialogStore.set(defaultDialog);
};
