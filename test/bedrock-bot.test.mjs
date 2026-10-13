import { EventEmitter } from 'node:events';
import test from 'node:test';
import assert from 'node:assert/strict';
import { BedrockBot } from '../src/bedrock-bot.mjs';

function fixture() {
  const client = new EventEmitter();
  client.username = 'Bot';
  client.sent = [];
  client.queue = (kind, data) => client.sent.push([kind, data]);
  client.close = () => client.emit('close');
  let time = 10000;
  const bot = new BedrockBot({ mode: 'friend', profile: 'Bot', worldName: 'Mine', worldHost: '', authDir: '/tmp/bot', chatCooldownMs: 2000 }, {
    createClient: () => client,
    clock: () => time
  });
  return { bot, client, advance: (ms) => { time += ms; } };
}
test('bot starts and records observed chat', () => {
  const { bot, client } = fixture();
  assert.throws(() => bot.sendChat('hi'), /spawn/);
  bot.connect();
  assert.equal(bot.getState().status, 'connecting');
  client.emit('join');
  client.emit('spawn');
  assert.equal(bot.getState().status, 'spawned');
  client.emit('text', { source_name: 'Human', message: 'Hey bot' });
  assert.deepEqual(bot.getChat(1).map((x) => x.message), ['Hey bot']);
  bot.disconnect();
  assert.equal(bot.getState().status, 'disconnected');
});
test('chat sends Bedrock packet and enforces safety limits', () => {
  const { bot, client, advance } = fixture();
  bot.connect();
  client.emit('spawn');
  assert.equal(bot.sendChat('Hello!').queued, true);
  assert.equal(client.sent[0][0], 'text');
  assert.equal(client.sent[0][1].message, 'Hello!');
  assert.throws(() => bot.sendChat('spam'), /rate limit/);
  advance(2000);
  assert.throws(() => bot.sendChat('/kill @e'), /slash commands/);
  assert.throws(() => bot.sendChat('hello\nworld'), /Newlines/);
  assert.equal(bot.sendChat('Safe').queued, true);
});
test('records errors and disconnections', () => {
  const { bot, client } = fixture();
  bot.connect();
  client.emit('error', new Error('network closed'));
  assert.equal(bot.getState().status, 'error');
  assert.equal(bot.getState().lastError, 'network closed');
  client.emit('close');
  assert.equal(bot.getState().status, 'disconnected');
});
