import { makeClientOptions } from './worlds.mjs';

export class BedrockBot {
  constructor(config, { createClient, log = () => {}, clock = () => Date.now() }) {
    this.config = config;
    this.createClient = createClient;
    this.log = log;
    this.clock = clock;
    this.client = null;
    this.status = 'disconnected';
    this.chat = [];
    this.lastChatAt = -Infinity;
    this.lastError = null;
    this.joinedAt = null;
    this.players = new Map();
  }

  connect() {
    if (this.client) throw new Error('Bot has already started');
    this.status = 'connecting';
    try {
      const client = this.createClient(makeClientOptions(this.config, this.log));
      this.client = client;
      client.on('join', () => { this.status = 'joined'; this.log('Authenticated and joined world'); });
      client.on('spawn', () => {
        this.status = 'spawned';
        this.joinedAt = new Date(this.clock()).toISOString();
        this.log('Bot spawned into the world');
      });
      client.on('text', (packet) => {
        const message = typeof packet?.message === 'string' ? packet.message : null;
        if (message === null) return;
        this.chat.push({ from: String(packet.source_name ?? ''), message, time: new Date(this.clock()).toISOString() });
        this.chat = this.chat.slice(-50);
      });
      client.on('add_player', (packet) => {
        if (typeof packet?.username === 'string') this.players.set(String(packet.uuid ?? packet.username), packet.username);
      });
      client.on('remove_player', (packet) => {
        for (const record of packet?.records ?? []) this.players.delete(String(record.uuid));
      });
      client.on('kick', (reason) => {
        this.lastError = `Kicked: ${String(reason)}`;
        this.status = 'disconnected';
        this.log(this.lastError);
      });
      client.on('error', (err) => {
        this.lastError = err?.message ?? String(err);
        this.status = 'error';
        this.log('Bedrock error', this.lastError);
      });
      client.on('close', () => {
        this.status = 'disconnected';
        this.client = null;
        this.players.clear();
        this.log('Connection closed');
      });
    } catch (err) {
      this.status = 'error';
      this.lastError = err?.message ?? String(err);
      throw err;
    }
  }

  getState() {
    return {
      status: this.status, mode: this.config.mode, profile: this.config.profile,
      world: this.config.mode === 'friend' ? this.config.worldName : this.config.mode === 'realm' ? this.config.realmId : `${this.config.host}:${this.config.port}`,
      joinedAt: this.joinedAt, lastError: this.lastError,
      observedPlayers: [...new Set(this.players.values())].sort(),
      capabilities: ['connection', 'chat-read', 'chat-send', 'player-join-events'],
      unimplemented: ['navigation', 'mining', 'building', 'combat', 'inventory', 'autonomous-agent-loop']
    };
  }

  getChat(limit = 10) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error('Chat limit must be 1..50');
    return this.chat.slice(-limit);
  }

  sendChat(message) {
    if (this.status !== 'spawned' || !this.client) throw new Error('Bot must spawn before sending chat');
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 160) {
      throw new Error('Chat must be 1..160 characters');
    }
    if (/\r|\n/.test(message) || message.trimStart().startsWith('/')) {
      throw new Error('Newlines and slash commands are disabled');
    }
    const now = this.clock();
    if (now - this.lastChatAt < this.config.chatCooldownMs) throw new Error('Chat rate limit exceeded');
    this.client.queue('text', {
      type: 'chat', needs_translation: false, source_name: this.client.username ?? this.config.profile,
      xuid: '', platform_chat_id: '', filtered_message: '', message
    });
    this.lastChatAt = now;
    return { queued: true, message };
  }

  disconnect() {
    if (!this.client) return { disconnected: true };
    const client = this.client;
    this.client = null;
    this.status = 'disconnected';
    client.close();
    return { disconnected: true };
  }
}
