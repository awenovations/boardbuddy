<script lang="ts">
	import type Quill from 'quill';
	import 'quill/dist/quill.snow.css';
	import '$lib/styles/quill-content.css';
	import type { Snippet } from 'svelte';

	interface Props {
		content?: string;
		name?: string;
		errors?: Snippet;
		label?: Snippet;
		showErrors?: boolean;
	}

	let { content = '', name, errors, showErrors, label }: Props = $props();

	let contentEL: HTMLInputElement;

	$effect(() => {
		let quill: Quill | undefined;

		(async () => {
			const Quill = (await import('quill')).default;

			quill = new Quill('#editor', {
				theme: 'snow'
			});

			quill.on('text-change', () => {
				let textContentValue = quill.root.textContent || quill.root.innerText;

				if (textContentValue.trim() === '') {
					contentEL.value = '';
				} else {
					contentEL.value = quill.root.innerHTML;
				}
			});

			quill.root.innerHTML = content;
		})();

		return () => {
			if (quill) {
				quill.off('text-change');
			}
		};
	});
</script>

<div class="editor-container ql-content" class:error={showErrors}>
	{#if label}
		{@render label()}
	{/if}

	{#if name}
		<!-- Note: this is a text input for form validation -->
		<input required bind:this={contentEL} class="hidden-input" {name} value={content} />
	{/if}

	<div id="editor"></div>

	{#if errors && showErrors}
		<span class="errors-text">
			{@render errors()}
		</span>
	{/if}
</div>

<style>
	.hidden-input {
		display: none;
	}
	.editor-container {
		border-radius: 0.313rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: visible;

		:global(.ql-toolbar),
		:global(.ql-container) {
			border: 1px solid var(--aura-form-item-border-color);

			.error & {
				border-color: var(--aura-form-item-error-border-color) !important;
			}
		}

		:global(.ql-toolbar) {
			border-radius: 0.313rem 0.313rem 0 0;
			background: white;
		}

		:global(.ql-toolbar .ql-stroke) {
			stroke: var(--aura-light-font-color);
		}

		:global(.ql-toolbar .ql-fill) {
			fill: var(--aura-light-font-color);
		}

		:global(.ql-toolbar .ql-picker-label) {
			color: var(--aura-light-font-color);
		}

		:global(.ql-container) {
			background: white;
			color: var(--aura-light-font-color);
			font-family: Roboto, sans-serif;
		}

		#editor {
			border-radius: 0 0 0.313rem 0.313rem;
			height: 229px;
		}
	}

	.errors-text {
		font: var(--aura-button-small);
		color: var(--aura-form-item-error-text-color);
		font-weight: 300;
		margin-top: 3px;
	}
</style>
