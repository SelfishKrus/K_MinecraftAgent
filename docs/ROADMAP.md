# Implementation roadmap

All phases require integration tests on Minecraft Bedrock; unit tests alone are insufficient.

## Phase 0 — Working foundation (in this starter)

- [x] Three connection modes: friend-hosted world, Realm, dedicated server
- [x] Xbox/Microsoft authentication delegation to bedrock-protocol
- [x] Select exact friend world by name; fail on ambiguity
- [x] Observe join/spawn/errors, recent chat, basic player join events
- [x] MCP tool server for connection state and chat
- [x] Unit tests and credential-safe configuration
- [ ] Verify actual account login and join for the user's particular Bedrock version/network

## Phase 1 — Physical presence and navigation

- [ ] Implement correct server-authoritative player input for the negotiated Bedrock protocol version (`player_auth_input` where appropriate)
- [ ] Observe local player position via authoritative world packets
- [ ] Move 3 blocks on flat ground and verify actual displacement
- [ ] Stop movement on disconnect or any uncertain world state
- [ ] Report target reached / obstruction explicitly

## Phase 2 — World interaction

- [ ] Decode nearby chunks and block IDs; maintain world state
- [ ] Inventory snapshot and selected hotbar slot
- [ ] Mine a designated test block with appropriate inventory/creative/survival handling
- [ ] Place a block and verify changed world data
- [ ] Pathfinding with collision, swimming, jumping and world changes

## Phase 3 — AI teammate

- [ ] Restrict command messages to an approved player XUID
- [ ] `/follow`-style instruction via normal chat with safe command parser (NOT slash execution)
- [ ] Follow owner, gather materials, build simple shelter
- [ ] Configurable autonomy, cancellation and emergency stop
- [ ] Watchdog for stuck action loops and rate/budget limits

## Phase 4 — Survival autonomy

- [ ] Health/food/mob perception, combat and survival policies
- [ ] Durable objective/task memory, observe → plan → act → verify controller
- [ ] Replay logs, regression tests and permissions audit
- [ ] Optional policies/planners (Claude, Codex, or another model); independent of bot transport
