import { readConfig } from './config.mjs';
try {
  const { mode, profile, worldName, worldHost, host, port, realmId, offline } = readConfig();
  console.log(JSON.stringify({ mode, profile, worldName, worldHost, host, port, realmId, offline }, null, 2));
  console.log('Configuration valid. Does NOT test Microsoft login or Minecraft connectivity.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
