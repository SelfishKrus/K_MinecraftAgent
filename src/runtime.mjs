import bedrock from 'bedrock-protocol';
import { BedrockBot } from './bedrock-bot.mjs';
import { readConfig } from './config.mjs';

function log(...parts) {
  // STDERR ONLY: stdout is reserved for MCP protocol messages.
  console.error('[K_MinecraftAgent]', ...parts);
}

export function makeBot() {
  return new BedrockBot(readConfig(), { createClient: bedrock.createClient, log });
}

export function wireShutdown(bot) {
  const shutdown = () => {
    try { bot.disconnect(); } catch (error) { log('Disconnect failed', error?.message ?? String(error)); }
    process.exitCode = 0;
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
