import fs from 'node:fs';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import findNodeModules from 'find-node-modules';

export async function GET({ params }: RequestEvent) {
	const { name } = params;

	const iconsPath = path.join(
		path.normalize(findNodeModules({ relative: false })[0]),
		'@awenovations/aura/dist/icons',
		name
	);

	if (fs.existsSync(iconsPath)) {
		return new Response(fs.readFileSync(iconsPath), {
			headers: { 'Content-Type': 'image/svg+xml' }
		});
	} else {
		return error(404, {
			message: 'Not found'
		});
	}
}
