<script lang="ts">
	import type Quill from 'quill';
	import 'quill/dist/quill.snow.css';
	import '$lib/styles/quill-content.css';
	import type { Snippet } from 'svelte';
	import DiagramEditor from '$lib/components/diagram-editor/diagram-editor.svelte';
	import { svgToDataUri, encodeXml, decodeXml } from '$lib/components/diagram-editor/drawio-utils';

	interface Props {
		content?: string;
		name?: string;
		errors?: Snippet;
		label?: Snippet;
		showErrors?: boolean;
	}

	let { content = '', name, errors, showErrors, label }: Props = $props();

	let contentEL: HTMLInputElement;
	let quillInstance: Quill | undefined = $state();
	let diagramEditorOpen = $state(false);
	let editingDiagramXml: string | null = $state(null);
	let editingDiagramImg: HTMLImageElement | null = $state(null);

	function openDiagramEditor(xml: string | null = null, img: HTMLImageElement | null = null) {
		editingDiagramXml = xml;
		editingDiagramImg = img;
		diagramEditorOpen = true;
	}

	function handleDiagramSave(svg: string, xml: string) {
		if (!quillInstance) return;

		const dataUri = svgToDataUri(svg);
		const encodedXml = encodeXml(xml);

		if (editingDiagramImg) {
			editingDiagramImg.setAttribute('src', dataUri);
			editingDiagramImg.setAttribute('data-drawio', encodedXml);
			contentEL.value = quillInstance.root.innerHTML;
		} else {
			const range = quillInstance.getSelection(true);
			quillInstance.insertEmbed(range.index, 'diagramImage', {
				src: dataUri,
				drawio: encodedXml
			});
			quillInstance.setSelection(range.index + 1, 0);
		}

		diagramEditorOpen = false;
		editingDiagramXml = null;
		editingDiagramImg = null;
	}

	function handleDiagramClose() {
		diagramEditorOpen = false;
		editingDiagramXml = null;
		editingDiagramImg = null;
	}

	$effect(() => {
		let quill: Quill | undefined;

		(async () => {
			const Quill = (await import('quill')).default;

			// Register custom blot for diagram images
			const BlockEmbed = Quill.import('blots/block/embed') as any;

			class DiagramImageBlot extends BlockEmbed {
				static blotName = 'diagramImage';
				static tagName = 'IMG';
				static className = 'drawio-diagram';

				static create(value: { src: string; drawio: string }) {
					const node = super.create() as HTMLImageElement;
					node.setAttribute('src', value.src);
					node.setAttribute('data-drawio', value.drawio);
					node.setAttribute('class', 'drawio-diagram');
					return node;
				}

				static value(node: HTMLImageElement) {
					return {
						src: node.getAttribute('src') || '',
						drawio: node.getAttribute('data-drawio') || ''
					};
				}

				static formats(node: HTMLImageElement) {
					return {
						src: node.getAttribute('src') || '',
						drawio: node.getAttribute('data-drawio') || ''
					};
				}
			}

			Quill.register(DiagramImageBlot, true);

			quill = new Quill('#editor', {
				theme: 'snow',
				modules: {
					toolbar: {
						container: [
							[{ header: [1, 2, 3, false] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ list: 'ordered' }, { list: 'bullet' }],
							['blockquote', 'code-block'],
							['link', 'image'],
							['diagram'],
							['clean']
						],
						handlers: {
							diagram: () => openDiagramEditor()
						}
					}
				}
			});

			quillInstance = quill;

			quill.on('text-change', () => {
				let textContentValue = quill.root.textContent || quill.root.innerText;

				if (textContentValue.trim() === '') {
					contentEL.value = '';
				} else {
					contentEL.value = quill.root.innerHTML;
				}
			});

			quill.root.innerHTML = content;

			// Double-click handler for editing existing diagrams
			quill.root.addEventListener('dblclick', (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (target.tagName === 'IMG' && target.hasAttribute('data-drawio')) {
					const encoded = target.getAttribute('data-drawio')!;
					const xml = decodeXml(encoded);
					openDiagramEditor(xml, target as HTMLImageElement);
				}
			});
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

{#if diagramEditorOpen}
	<DiagramEditor
		initialXml={editingDiagramXml}
		onSave={handleDiagramSave}
		onClose={handleDiagramClose}
	/>
{/if}

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

		:global(.ql-diagram) {
			width: 28px;
			height: 24px;
			padding: 0;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		:global(.ql-diagram::after) {
			content: '';
			display: inline-block;
			width: 18px;
			height: 18px;
			background-color: var(--aura-light-font-color, #444);
			mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='2' y='3' width='7' height='5' rx='1' fill='currentColor'/%3E%3Crect x='15' y='3' width='7' height='5' rx='1' fill='currentColor'/%3E%3Crect x='8' y='16' width='8' height='5' rx='1' fill='currentColor'/%3E%3Cpath d='M5.5 8v3h13V8M12 11v5' stroke='currentColor' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
			mask-size: contain;
			mask-repeat: no-repeat;
			-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='2' y='3' width='7' height='5' rx='1' fill='currentColor'/%3E%3Crect x='15' y='3' width='7' height='5' rx='1' fill='currentColor'/%3E%3Crect x='8' y='16' width='8' height='5' rx='1' fill='currentColor'/%3E%3Cpath d='M5.5 8v3h13V8M12 11v5' stroke='currentColor' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
			-webkit-mask-size: contain;
			-webkit-mask-repeat: no-repeat;
		}

		:global(.ql-diagram:hover::after) {
			background-color: var(--aura-highlight, #06c);
		}

		:global(.ql-editor .drawio-diagram) {
			max-width: 100%;
			height: auto;
			display: block;
			margin: 8px 0;
			border: 1px solid var(--aura-container-border-color, #ddd);
			border-radius: 4px;
			background: white;
			cursor: pointer;
		}
	}

	.errors-text {
		font: var(--aura-button-small);
		color: var(--aura-form-item-error-text-color);
		font-weight: 300;
		margin-top: 3px;
	}
</style>
