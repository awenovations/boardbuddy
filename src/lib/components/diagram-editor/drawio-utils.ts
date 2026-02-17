export const DRAWIO_EMBED_URL = 'https://embed.diagrams.net/?embed=1&proto=json&spin=1&noSaveBtn=1&noExitBtn=1';

export type DrawioMessage =
	| { event: 'init' }
	| { event: 'save'; xml: string }
	| { event: 'export'; data: string; format: string }
	| { event: 'exit' };

export function svgToDataUri(svg: string): string {
  console.log(svg)
  return svg; //'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

export function encodeXml(xml: string): string {
	return btoa(unescape(encodeURIComponent(xml)));
}

export function decodeXml(encoded: string): string {
	return decodeURIComponent(escape(atob(encoded)));
}

export function parseDrawioMessage(event: MessageEvent): DrawioMessage | null {
	if (typeof event.data !== 'string') return null;
	try {
		const msg = JSON.parse(event.data);
		if (msg && typeof msg.event === 'string') {
			return msg as DrawioMessage;
		}
	} catch {
		// not a JSON message from draw.io
	}
	return null;
}

export function postToDrawio(iframe: HTMLIFrameElement, action: Record<string, unknown>): void {
	iframe.contentWindow?.postMessage(JSON.stringify(action), '*');
}
