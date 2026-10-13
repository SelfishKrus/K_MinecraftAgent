import path from 'node:path';

const allowedModes = new Set(['friend', 'server', 'realm']);

function portNumber(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 65535) {
    throw new Error('BEDROCK_PORT must be a number between 1 and 65535');
  }
  return number;
}

export function readConfig(env = process.env) {
  const mode = (env.BEDROCK_MODE ?? 'friend').trim().toLowerCase();
  if (!allowedModes.has(mode)) throw new Error('BEDROCK_MODE must be friend, server, or realm');
  const profile = (env.BOT_PROFILE ?? '').trim();
  if (!profile) throw new Error('BOT_PROFILE must identify the bot\'s separate Xbox profile');
  const worldName = (env.BEDROCK_WORLD_NAME ?? '').trim();
  const worldHost = (env.BEDROCK_WORLD_HOST ?? '').trim();
  const realmId = (env.BEDROCK_REALM_ID ?? '').trim();
  const host = (env.BEDROCK_HOST ?? '127.0.0.1').trim();
  const port = portNumber(env.BEDROCK_PORT ?? '19132');
  const offline = (env.BEDROCK_OFFLINE ?? 'false').toLowerCase() === 'true';
  const cooldown = Number(env.BOT_CHAT_COOLDOWN_MS ?? '2000');
  if (!Number.isInteger(cooldown) || cooldown < 500) {
    throw new Error('BOT_CHAT_COOLDOWN_MS must be at least 500');
  }
  if (mode === 'friend' && !worldName) throw new Error('BEDROCK_WORLD_NAME is required for friend mode');
  if (mode === 'server' && !host) throw new Error('BEDROCK_HOST is required for server mode');
  if (mode === 'realm' && !realmId) throw new Error('BEDROCK_REALM_ID is required for realm mode');
  if (offline && mode !== 'server') throw new Error('BEDROCK_OFFLINE is only allowed in server mode');
  return {
    mode, profile, worldName, worldHost, host, port, realmId, offline,
    authDir: path.resolve(env.BEDROCK_AUTH_DIR ?? '.minecraft-auth'),
    chatCooldownMs: cooldown
  };
}
