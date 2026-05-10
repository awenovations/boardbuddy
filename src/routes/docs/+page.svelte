<script lang="ts">
	import { page } from '$app/stores';
	import Container from '@awenovations/aura/container.svelte';

	const session = $derived($page.data.session);

	// prettier-ignore
	const claudeCodeSnippet =
`{
  "mcpServers": {
    "boardbuddy": {
      "url": "https://boardbuddy.cloud/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}`;

	// prettier-ignore
	const claudeDesktopSnippet =
`{
  "mcpServers": {
    "boardbuddy": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://boardbuddy.cloud/mcp/sse",
        "--header",
        "Authorization:Bearer YOUR_API_KEY_HERE"
      ]
    }
  }
}`;

	const tools = [
		{ name: 'list_columns', desc: 'Get the list of available board columns.' },
		{ name: 'list_tasks', desc: 'List your tasks. Filter by project, column, or root-level only.' },
		{ name: 'create_task', desc: 'Create a task or project card in a given column.' },
		{ name: 'update_task', desc: 'Update any fields on an existing task.' },
		{ name: 'delete_task', desc: 'Delete a task. Blocked if it is a project with children.' },
		{ name: 'move_tasks', desc: 'Move one or more tasks to a new column and/or reorder them.' },
		{ name: 'get_project', desc: 'Get a project card and all its child tasks.' },
		{ name: 'get_user_profile', desc: 'Get your BoardBuddy profile.' }
	];
</script>

<div class="wrapper" data-theme="light">
	<nav class="navbar">
		<div class="nav-content">
			<a href="/" class="nav-logo">BB</a>
			<div class="nav-links">
				{#if session?.user}
					<a href="/app" class="nav-link">Go to Board</a>
					<form method="POST" action="/signout" class="nav-signout-form">
						<button type="submit" class="nav-link">Sign out</button>
					</form>
				{:else}
					<a href="/pricing" class="nav-link">Pricing</a>
					<span class="nav-link nav-link-current">Docs</span>
					<a href="/signin" class="nav-link">Login</a>
					<a href="/signup" class="nav-signup">Sign Up</a>
				{/if}
			</div>
		</div>
	</nav>

	<main class="docs-main">
		<div class="docs-hero">
			<h1 class="hero-title">MCP Server</h1>
			<p class="hero-subtitle">
				Connect Claude to your BoardBuddy board. Manage tasks and projects directly from your AI
				assistant.
			</p>
		</div>

		<div class="docs-content">
			<!-- Step 1 -->
			<section class="doc-section">
				<h2 class="section-title">1. Generate an API Key</h2>
				<p class="section-body">
					Open the BoardBuddy app, click the settings icon in the top right, scroll to <strong
						>MCP API Keys</strong
					>, enter a name for the key, and click <strong>Generate</strong>. Copy the key immediately
					— it is only shown once.
				</p>
			</section>

			<!-- Step 2 -->
			<section class="doc-section">
				<h2 class="section-title">2. Claude Code</h2>
				<p class="section-body">
					Copy <code>.mcp.json.example</code> to <code>.mcp.json</code> at your project root and fill
					in your key:
				</p>
				<Container variant="filled" class="code-block" clearPadding>
					<pre>{claudeCodeSnippet}</pre>
				</Container>
			</section>

			<!-- Step 3 -->
			<section class="doc-section">
				<h2 class="section-title">3. Claude Desktop</h2>
				<p class="section-body">
					Add the following to your Claude Desktop config file, then restart Claude Desktop.
				</p>
				<div class="platform-paths">
					<div class="platform-row">
						<span class="platform-name">macOS</span>
						<code class="platform-path"
							>~/Library/Application Support/Claude/claude_desktop_config.json</code
						>
					</div>
					<div class="platform-row">
						<span class="platform-name">Linux</span>
						<code class="platform-path">~/.config/Claude/claude_desktop_config.json</code>
					</div>
					<div class="platform-row">
						<span class="platform-name">Windows</span>
						<code class="platform-path">%APPDATA%\Claude\claude_desktop_config.json</code>
					</div>
				</div>
				<Container variant="filled" class="code-block" clearPadding>
					<pre>{claudeDesktopSnippet}</pre>
				</Container>
				<p class="section-note">
					Note: no space between <code>Authorization:</code> and <code>Bearer</code>. Restart Claude
					Desktop after saving.
				</p>
			</section>

			<!-- Tools -->
			<section class="doc-section">
				<h2 class="section-title">Available Tools</h2>
				<div class="tools-list">
					{#each tools as tool}
						<div class="tool-row">
							<code class="tool-name">{tool.name}</code>
							<span class="tool-desc">{tool.desc}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Troubleshooting -->
			<section class="doc-section">
				<h2 class="section-title">Troubleshooting</h2>
				<div class="trouble-list">
					<div class="trouble-row">
						<span class="trouble-code">401 Unauthorized</span>
						<span class="trouble-desc"
							>Your API key is invalid or revoked. Generate a new one in Settings.</span
						>
					</div>
					<div class="trouble-row">
						<span class="trouble-code">404 Session not found</span>
						<span class="trouble-desc">The SSE connection dropped. Restart your MCP client.</span>
					</div>
					<div class="trouble-row">
						<span class="trouble-code">Cannot delete project with children</span>
						<span class="trouble-desc"
							>Use <code>list_tasks</code> with the project ID, move or delete children first, then
							delete the project.</span
						>
					</div>
				</div>
			</section>
		</div>
	</main>

	<footer class="landing-footer">
		<div class="footer-inner">
			&copy; {new Date().getFullYear()} Benjamin Knox | Feedback:&nbsp;<a
				href="mailto:ben@knoxes.email"
				class="footer-link">ben@knoxes.email</a
			>&nbsp;| My Website:&nbsp;<a href="https://knox.pro" target="_blank" class="footer-link"
				>knox.pro</a
			>
		</div>
	</footer>
</div>

<style lang="scss">
	.wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--aura-light-background);
	}

	/* ========== Navbar ========== */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--aura-container-border-color);
	}

	.nav-content {
		max-width: 80rem;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-logo {
		font: var(--aura-h3);
		color: var(--aura-secondary-40);
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.nav-signout-form {
		display: inline;
	}

	.nav-link {
		color: var(--aura-tertiary-60);
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font: var(--aura-default-regular);
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s;

		&:hover {
			color: var(--aura-secondary-40);
		}

		&.nav-link-current {
			color: var(--aura-secondary-40);
			font: var(--aura-default-semibold);
			cursor: default;
		}
	}

	.nav-signup {
		background: var(--aura-secondary-40);
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font: var(--aura-default-semibold);
		text-decoration: none;
		transition: background-color 0.2s;

		&:hover {
			background: var(--aura-tertiary-60);
		}
	}

	/* ========== Main ========== */
	.docs-main {
		flex: 1;
		padding: 7rem 1.5rem 5rem;
		max-width: 52rem;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}

	.docs-hero {
		margin-bottom: 3rem;
	}

	.hero-title {
		font: var(--aura-display2);
		color: var(--aura-secondary-40);
		margin-bottom: 0.75rem;
	}

	.hero-subtitle {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		font-size: 1.125rem;
		line-height: 1.6;
	}

	/* ========== Sections ========== */
	.docs-content {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.doc-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font: var(--aura-h3);
		color: var(--aura-secondary-40);
	}

	.section-body {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		line-height: 1.7;

		strong {
			color: var(--aura-font-color);
		}

		code {
			font-family: monospace;
			font-size: 0.875em;
			background: color-mix(in srgb, var(--aura-secondary-40) 10%, transparent);
			padding: 0.1em 0.4em;
			border-radius: 0.25rem;
		}
	}

	.section-note {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		font-size: 0.875rem;

		code {
			font-family: monospace;
			font-size: 0.875em;
			background: color-mix(in srgb, var(--aura-secondary-40) 10%, transparent);
			padding: 0.1em 0.4em;
			border-radius: 0.25rem;
		}
	}

	:global(.code-block) {
		width: 100%;
		box-sizing: border-box;
	}

	:global(.code-block) pre {
		font-family: monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
		color: var(--aura-font-color);
		margin: 0;
    text-align: left;
	}

	/* ========== Tools ========== */
	.tools-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid var(--aura-container-border-color);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.tool-row {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		padding: 0.875rem 1.25rem;
		border-bottom: 1px solid var(--aura-container-border-color);

		&:last-child {
			border-bottom: none;
		}

		&:nth-child(even) {
			background: color-mix(in srgb, var(--aura-secondary-40) 4%, transparent);
		}
	}

	.tool-name {
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--aura-secondary-40);
		min-width: 14rem;
		flex-shrink: 0;
	}

	.tool-desc {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		font-size: 0.9rem;
	}

	/* ========== Platform Paths ========== */
	.platform-paths {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid var(--aura-container-border-color);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.platform-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid var(--aura-container-border-color);

		&:last-child {
			border-bottom: none;
		}

		&:nth-child(even) {
			background: color-mix(in srgb, var(--aura-secondary-40) 4%, transparent);
		}
	}

	.platform-name {
		font: var(--aura-default-semibold);
		color: var(--aura-font-color);
		min-width: 5rem;
		flex-shrink: 0;
	}

	.platform-path {
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--aura-tertiary-60);
		word-break: break-all;
	}

	/* ========== Troubleshooting ========== */
	.trouble-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.trouble-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.trouble-code {
		font-family: monospace;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--aura-font-color);
	}

	.trouble-desc {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		line-height: 1.6;

		code {
			font-family: monospace;
			font-size: 0.875em;
			background: color-mix(in srgb, var(--aura-secondary-40) 10%, transparent);
			padding: 0.1em 0.4em;
			border-radius: 0.25rem;
		}
	}

	/* ========== Footer ========== */
	.landing-footer {
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--aura-container-border-color);
	}

	.footer-inner {
		max-width: 80rem;
		margin: 0 auto;
		text-align: center;
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
	}

	.footer-link {
		color: var(--aura-link-color);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
