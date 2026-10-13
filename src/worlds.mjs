/** Select only a uniquely matching world to avoid accidentally joining the wrong world. */
export function selectFriendWorld(sessions, { worldName, worldHost = '' }) {
  if (!Array.isArray(sessions)) throw new Error('Bedrock world discovery did not return a session list');
  const matches = sessions.filter((s) => {
    const props = s?.customProperties ?? {};
    return props.worldName === worldName && (!worldHost || props.hostName === worldHost);
  });
  if (matches.length !== 1) {
    const visible = sessions.map((s) => {
      const p = s?.customProperties ?? {};
      return `${p.worldName ?? '(unnamed)'} / ${p.hostName ?? '(unknown host)'}`;
    });
    throw new Error(
      `Expected exactly one matching friend world '${worldName}'${worldHost ? ` hosted by '${worldHost}'` : ''}; ` +
      `found ${matches.length}. Available: ${visible.join('; ') || '(none)'}. Check bot account friendship and world settings.`
    );
  }
  return matches[0];
}

export function makeClientOptions(config, log = () => {}) {
  const options = {
    username: config.profile,
    profilesFolder: config.authDir,
    conLog: null, // Important for stdio MCP: library must not write to stdout.
    onMsaCode: (info) => log('Microsoft sign-in required', info)
  };
  switch (config.mode) {
    case 'friend':
      options.world = { pickSession: (sessions) => selectFriendWorld(sessions, config) };
      break;
    case 'realm':
      options.realms = { realmId: config.realmId };
      break;
    case 'server':
      options.host = config.host;
      options.port = config.port;
      options.offline = config.offline;
      break;
    default:
      throw new Error(`Unsupported Bedrock mode ${config.mode}`);
  }
  return options;
}
