import test from 'node:test';
import assert from 'node:assert/strict';
import { selectFriendWorld, makeClientOptions } from '../src/worlds.mjs';

const sessions = [
  { customProperties: { worldName: 'Home', hostName: 'Alice' } },
  { customProperties: { worldName: 'Home', hostName: 'Bob' } },
  { customProperties: { worldName: 'Mine', hostName: 'Cara' } }
];

test('selectFriendWorld requires a unique exact match', () => {
  assert.equal(selectFriendWorld(sessions, { worldName: 'Mine' }), sessions[2]);
  assert.equal(selectFriendWorld(sessions, { worldName: 'Home', worldHost: 'Bob' }), sessions[1]);
  assert.throws(() => selectFriendWorld(sessions, { worldName: 'Home' }), /found 2/);
  assert.throws(() => selectFriendWorld(sessions, { worldName: 'home' }), /found 0/);
});
test('client options support all connection modes', () => {
  const base = { profile: 'Bot', authDir: '/tmp/bot', host: 'localhost', port: 19132, offline: false };
  const friend = makeClientOptions({ ...base, mode: 'friend', worldName: 'Mine', worldHost: '' });
  assert.equal(friend.world.pickSession(sessions), sessions[2]);
  assert.equal(friend.conLog, null);
  const realm = makeClientOptions({ ...base, mode: 'realm', realmId: '1234' });
  assert.equal(realm.realms.realmId, '1234');
  const server = makeClientOptions({ ...base, mode: 'server' });
  assert.equal(server.port, 19132);
});
