<script lang="ts">
	import Portal from 'svelte-portal';
	import Button from '@awenovations/aura/button.svelte';
	import {
		DRAWIO_EMBED_URL,
		parseDrawioMessage,
		postToDrawio
	} from './drawio-utils';

	interface Props {
		initialXml?: string | null;
		onSave: (svg: string, xml: string) => void;
		onClose: () => void;
	}

	let { initialXml = null, onSave, onClose }: Props = $props();

	let iframeEl: HTMLIFrameElement;
	let savedXml = '';
	let awaitingSvg = false;

	function handleMessage(event: MessageEvent) {
		const msg = parseDrawioMessage(event);
		if (!msg) return;

		switch (msg.event) {
			case 'init':
				postToDrawio(iframeEl, {
					action: 'load',
					xml: initialXml || ''
				});
				break;

			case 'save':
				// Triggered by draw.io's internal save (Ctrl+S)
				savedXml = msg.xml;
				awaitingSvg = true;
				postToDrawio(iframeEl, {
					action: 'export',
					format: 'xmlsvg',
					spin: 'Exporting'
				});
				break;

			case 'export':
				if (awaitingSvg) {
					// This is the SVG export response — finish the save
					awaitingSvg = false;
					onSave(msg.data, savedXml);
				} else if (msg.format === 'xml') {
					// This is the XML response from our "Save & Insert" button
					savedXml = msg.data;
					awaitingSvg = true;
					postToDrawio(iframeEl, {
						action: 'export',
						format: 'xmlsvg',
						spin: 'Exporting'
					});
				}
				break;

			case 'exit':
				onClose();
				break;
		}
	}

	function requestSave() {
		if (!iframeEl) return;
		// First get the current XML, then we'll chain to SVG export
		postToDrawio(iframeEl, { action: 'export', format: 'xml' });
	}

	$effect(() => {
		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	});
</script>

<Portal target="body">
	<div class="drawio-overlay" role="dialog" aria-label="Diagram editor">
		<div class="drawio-backdrop" onclick={onClose}></div>
		<div class="drawio-modal">
			<header class="drawio-header">
				<div class="drawio-title">
					<svg class="drawio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="2" y="3" width="7" height="5" rx="1" fill="currentColor"/>
						<rect x="15" y="3" width="7" height="5" rx="1" fill="currentColor"/>
						<rect x="8" y="16" width="8" height="5" rx="1" fill="currentColor"/>
						<path d="M5.5 8v3h13V8M12 11v5" stroke="currentColor" stroke-width="1.5"/>
					</svg>
					Diagram Editor
				</div>
			</header>
			<div class="drawio-body">
				<iframe
					bind:this={iframeEl}
					src={DRAWIO_EMBED_URL}
					title="Diagram editor"
					class="drawio-iframe"
				></iframe>
			</div>
		</div>
	</div>
</Portal>

<style>
	.drawio-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.drawio-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 40%);
		backdrop-filter: blur(0.2rem);
	}

	.drawio-modal {
		position: relative;
		width: calc(100vw - 3rem);
		height: calc(100vh - 3rem);
		max-width: 1400px;
		max-height: 900px;
		display: flex;
		flex-direction: column;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
		background: white;
	}

	.drawio-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem 1rem;
		background: var(--aura-container-bg-color, #f8f9fa);
		border-bottom: 1px solid var(--aura-container-border-color, #ddd);
		flex-shrink: 0;
	}

	.drawio-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: Roboto, sans-serif;
		font-size: 0.938rem;
		font-weight: 500;
		color: var(--aura-light-font-color, #444);
	}

	.drawio-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--aura-highlight, #06c);
	}

	.drawio-actions {
		display: flex;
		gap: 0.5rem;
	}

	.drawio-body {
		flex: 1;
		overflow: hidden;
	}

	.drawio-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
