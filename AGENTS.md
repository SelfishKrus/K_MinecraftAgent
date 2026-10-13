# Agent instructions (Codex / Claude Code)

This is **Minecraft Bedrock Edition** (Windows 10/11), not Minecraft Java. A protocol client logs in as a **separate Xbox account** to a friend-hosted world, Realm, or Bedrock server.

## Important

- Only claim features which are implemented and tested. Current version supports connection and chat; it does not yet navigate, mine or fight.
- Build real Bedrock packet handling before adding MCP tools. Do not treat Java Mineflayer methods as usable on Bedrock.
- Keep MCP stdout absolutely clean (JSON-RPC only); use stderr for diagnostics.
- Never commit `.env`, `.minecraft-auth/`, secrets or Xbox auth tokens.
- Do not send arbitrary command_request packets or bypass server permissions.
- Default to safe, rate-limited player actions; test with a local throwaway world.
- Use `npm run verify` before proposing changes. Integration with live Minecraft requires human test.

## Next priorities

1. Record/normalize the relevant Bedrock player/world packets using specific supported game versions.
2. Implement authoritative input movement and position verification.
3. Implement inventory observation and block observation.
4. Add collision-aware pathfinding, mining, crafting, and following the human player.
5. Only then add an explicit autonomous observe → plan → act → verify loop.

See `docs/ROADMAP.md` for acceptance checks.
