import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { makeBot, wireShutdown } from './runtime.mjs';

const bot = makeBot();
wireShutdown(bot);

function result(fn) {
  try { return { content: [{ type: 'text', text: JSON.stringify(fn(), null, 2) }] }; }
  catch (error) {
    return { isError: true, content: [{ type: 'text', text: error?.message ?? String(error) }] };
  }
}

function createServer() {
  const server = new McpServer({ name: 'k-minecraft-bedrock', version: '0.1.0' });
  server.registerTool('minecraft_status', {
    description: 'Inspect Bedrock bot connection status and currently implemented capabilities',
    inputSchema: z.object({})
  }, async () => result(() => bot.getState()));
  server.registerTool('minecraft_recent_chat', {
    description: 'Read recent observed chat messages (up to 50)',
    inputSchema: z.object({ limit: z.number().int().min(1).max(50).default(10) })
  }, async ({ limit }) => result(() => bot.getChat(limit)));
  server.registerTool('minecraft_send_chat', {
    description: 'Send a short ordinary chat message. No slash commands or multiline messages.',
    inputSchema: z.object({ message: z.string().min(1).max(160) })
  }, async ({ message }) => result(() => bot.sendChat(message)));
  server.registerTool('minecraft_disconnect', {
    description: 'Disconnect this bot account from the Minecraft world.',
    inputSchema: z.object({})
  }, async () => result(() => bot.disconnect()));
  return server;
}

// Start stdio before attempting Bedrock login; Microsoft auth notices go to stderr.
void serveStdio(createServer).then(() => {
  console.error('[K_MinecraftAgent] MCP ready; starting Minecraft connection');
  try { bot.connect(); } catch (error) { console.error('[K_MinecraftAgent] Bedrock connection failed:', error?.message ?? String(error)); }
}).catch((error) => {
  console.error('[K_MinecraftAgent] MCP startup failed:', error);
  process.exitCode = 1;
});
