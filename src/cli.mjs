import { makeBot, wireShutdown } from './runtime.mjs';

try {
  const bot = makeBot();
  wireShutdown(bot);
  console.error('[K_MinecraftAgent] Starting Bedrock connection. Press Ctrl+C to disconnect.');
  bot.connect();
} catch (error) {
  console.error('[K_MinecraftAgent] Startup failed:', error?.message ?? String(error));
  process.exitCode = 1;
}
