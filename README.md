# K_MinecraftAgent

A **Minecraft Bedrock / Windows 10/11 Edition** separate-player bot foundation, with MCP tools for **Codex CLI** and **Claude Code**. It uses [`bedrock-protocol`](https://github.com/PrismarineJS/bedrock-protocol) for Xbox authentication and game networking and the [MCP TypeScript server SDK](https://ts.sdk.modelcontextprotocol.io/v2/) for agent-facing tools.

> **Honest scope (v0.1.0):** connection, authentication handoff, join/spawn status, incoming chat, outgoing chat, and rudimentary observed-player events are implemented. **Movement, mining, crafting, pathfinding, building and autonomous survival have NOT been implemented.** See [roadmap](docs/ROADMAP.md). A working Bedrock login has not yet been integration-tested against your world.

## Prerequisites

- Windows 10/11 with **Minecraft Bedrock**; a world with **Multiplayer Game** enabled.
- Node.js **24+** and npm.
- A **second Microsoft/Xbox account** with a Minecraft entitlement/permissions adequate for joining the target world. Do not log in as your own player identity.
- In a friend's hosted world, the host must be online; add the bot's Xbox account as a friend, allow it to join, and check cross-platform/privacy permissions.
- Optional: Codex CLI or Claude Code installed, for MCP tool access.

## Quick start — friend-hosted Bedrock world

On Windows PowerShell:

```powershell
# From this project directory
npm install
Copy-Item .env.example .env
notepad .env
```

In `.env`, set `BEDROCK_MODE=friend`, `BOT_PROFILE=YourBotsMicrosoftAccountName` and `BEDROCK_WORLD_NAME=YourExactWorldName`. If several worlds have the same name, set `BEDROCK_WORLD_HOST` to match the advertised `hostName`.

```powershell
npm run config
npm run verify
npm run bot
```

Follow the Microsoft device-code sign-in prompt **with the bot's Xbox account**, not your main account. Device-code instructions are printed to the terminal. The bot stores authentication data in `.minecraft-auth/`, which is ignored by Git.

When the bot reaches `spawn`, it should be a *separate player* in your Bedrock world. `npm run bot` itself does not give it AI behaviors; Ctrl+C disconnects.

**Windows local-world note:** Native Bedrock local-world hosting may use authenticated Xbox/Nethernet friend sessions. Connecting via `127.0.0.1:19132` does not automatically join a friend's single-player/LAN world. Use `friend` mode for a normal hosted Bedrock world. If the game or account can't advertise friend sessions, try a dedicated Bedrock server (`server` mode) or a Realm. Joining from the same Windows PC can be more complicated because of Windows app networking and Xbox service access.

## Other connection modes

**Realm:** Set `BEDROCK_MODE=realm` and `BEDROCK_REALM_ID=<realm id>` in `.env`. The bot's Xbox account must be invited.

**Dedicated Bedrock server:** Set `BEDROCK_MODE=server`, `BEDROCK_HOST=<server IP/name>`, `BEDROCK_PORT=19132`. Use ordinary authenticated mode. `BEDROCK_OFFLINE=true` is only for deliberately unauthenticated local test servers.

## MCP with Codex or Claude Code

Stop `npm run bot` before connecting the agent: MCP starts its own Bedrock connection, and two processes using the same bot identity may conflict.

Register the MCP server from the project directory:

```powershell
# Codex CLI
codex mcp add minecraft-bedrock -- node --env-file=.env src/mcp.mjs

# Claude Code
claude mcp add --transport stdio minecraft-bedrock -- node --env-file=.env src/mcp.mjs
```

If the CLI starts its process from another working directory, change both `.env` and `src/mcp.mjs` to **absolute paths** (or configure the working directory). Verify tool availability in your client before trying a full prompt.

Try:

> Use the `minecraft_status` tool to check connection. After the bot spawns, call `minecraft_recent_chat` and send a short greeting using `minecraft_send_chat`.

### Available MCP tools

| Tool | Purpose |
| ---- | ------- |
| `minecraft_status` | Connection state, profile, limited observed players, capabilities |
| `minecraft_recent_chat` | Last 1–50 incoming chat messages |
| `minecraft_send_chat` | Queue ordinary chat, with a cooldown and no `/` commands |
| `minecraft_disconnect` | Disconnect bot from the world |

This MCP server **does not run an autonomous agent loop**; Codex/Claude decide which MCP tool to call. The movement/mine/build tools must be implemented and integration-tested first.

## Development

```powershell
npm run verify   # Node syntax checks and mocked unit tests; does NOT connect to Minecraft
npm run mcp      # Start stdio MCP server + Bedrock connection
```

All MCP logs go to stderr: stdout is reserved for MCP JSON-RPC. Do not put `console.log` in MCP runtime or auth callbacks.

### Code layout

- `src/config.mjs`: environment validation.
- `src/worlds.mjs`: safe friend-world selection and protocol options.
- `src/bedrock-bot.mjs`: minimal connection and observation adapter.
- `src/mcp.mjs`: MCP tools.
- `src/cli.mjs`: standalone connection smoke test.
- `test/`: fake-protocol unit tests, runnable offline.
- `AGENTS.md`, `docs/ROADMAP.md`: implementation plan and guardrails.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No friend worlds found | Bot and host are Xbox friends, host is online, world multiplayer enabled, correct world name, Xbox privacy settings |
| Authentication loops | Ensure you authorized the *bot* Microsoft account, delete only the bot's local auth cache to retry, inspect account permissions |
| Outdated client/server | Align game and supported `bedrock-protocol` version; `npm update` if needed |
| MCP won't launch | Run `npm run config`, use absolute file paths, check your CLI's MCP status |
| Bot joined but doesn't move | **Expected:** this version has no movement implementation yet |
| Bot can join a Realm but not a local hosted world | Different transport/discovery; try friend mode and check LAN/firewall and Xbox settings |

## Security

Credentials, `.env` and `.minecraft-auth` must never be committed. Treat chat read via MCP as granting the model access to in-game messages. Grant only the bot's normal game privileges. Do not expose the MCP stdio process over the network.

## Useful upstream docs

- [bedrock-protocol GitHub](https://github.com/PrismarineJS/bedrock-protocol)
- [bedrock-protocol API](https://github.com/PrismarineJS/bedrock-protocol/blob/master/docs/API.md)
- [MCP TypeScript SDK v2](https://ts.sdk.modelcontextprotocol.io/v2/)
