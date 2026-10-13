# Run from the project root in PowerShell on Windows.
$ErrorActionPreference = 'Stop'
if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env. Edit BOT_PROFILE and BEDROCK_WORLD_NAME before connecting.'
}
node --version
npm install
npm run verify
npm run config
Write-Host 'When ready: npm run bot (or register the MCP server as described in README.md)'
