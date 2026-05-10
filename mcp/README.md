# BoardBuddy MCP Server

The BoardBuddy MCP server lets AI assistants (Claude Code, Claude Desktop) manage your tasks and projects on your behalf.

It runs as part of the BoardBuddy web app — no local installation needed. You authenticate with an API key generated in your account settings.

## Generating an API Key

1. Open the BoardBuddy app and click the settings icon (top right)
2. Scroll to **MCP API Keys**
3. Enter a name for the key (e.g. "Claude Desktop") and click **Generate**
4. Copy the key immediately — it's only shown once

## Configuring Claude Code

Copy `.mcp.json.example` to `.mcp.json` at the project root and fill in your key:

```json
{
  "mcpServers": {
    "boardbuddy": {
      "url": "https://boardbuddy.cloud/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

Restart Claude Code. The BoardBuddy tools will appear automatically.

## Configuring Claude Desktop

Add the following to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "boardbuddy": {
      "url": "https://boardbuddy.cloud/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

Restart Claude Desktop.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_tasks` | List your tasks. Filter by project, column, or root-level only. |
| `create_task` | Create a task or project card in a given column. |
| `update_task` | Update any fields on an existing task. |
| `delete_task` | Delete a task. Blocked if it's a project with children. |
| `move_tasks` | Move one or more tasks to a new column and/or reorder them. |
| `get_project` | Get a project card and all its child tasks. |
| `get_user_profile` | Get your BoardBuddy profile. |

## Troubleshooting

**401 Unauthorized** — Your API key is invalid or has been revoked. Generate a new one in Settings.

**404 Session not found** — The SSE connection dropped. Reconnect (restart your MCP client).

**"Cannot delete project that contains items"** — Use `list_tasks` with the project's ID, delete or move the children first, then delete the project.
