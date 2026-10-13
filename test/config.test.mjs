import test from 'node:test';
import assert from 'node:assert/strict';
import { readConfig } from '../src/config.mjs';

const valid = { BEDROCK_MODE: 'friend', BOT_PROFILE: 'Bot', BEDROCK_WORLD_NAME: 'World' };

test('friend configuration is validated', () => {
  const cfg = readConfig(valid);
  assert.equal(cfg.mode, 'friend');
  assert.equal(cfg.worldName, 'World');
  assert.equal(cfg.port, 19132);
});
test('requires exact friend world name', () => {
  assert.throws(() => readConfig({ BOT_PROFILE: 'Bot' }), /BEDROCK_WORLD_NAME/);
});
test('requires realm ID and valid server port', () => {
  assert.throws(() => readConfig({ BEDROCK_MODE: 'realm', BOT_PROFILE: 'Bot' }), /REALM_ID/);
  assert.throws(() => readConfig({ BEDROCK_MODE: 'server', BOT_PROFILE: 'Bot', BEDROCK_PORT: '99999' }), /PORT/);
});
test('offline auth is forbidden for friend mode', () => {
  assert.throws(() => readConfig({ ...valid, BEDROCK_OFFLINE: 'true' }), /only allowed/);
});
