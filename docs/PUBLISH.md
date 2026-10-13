# Publish to the requested GitHub repository

Target repository: `https://github.com/SelfishKrus/K_MinecraftAgent.git`

The downloaded starter was developed without the existing repository history. Do not force-push or overwrite existing files without reviewing them.

## Option A — Repo is empty (PowerShell)

1. Download/extract the starter ZIP to a folder, e.g. `C:\Dev\K_MinecraftAgent`.
2. Open PowerShell in that project folder and run:

```powershell
git init
git branch -M main
git remote add origin https://github.com/SelfishKrus/K_MinecraftAgent.git
git add .
git commit -m "Bootstrap Bedrock AI bot and MCP tools"
git push -u origin main
```

If GitHub reports a non-fast-forward or existing repository content, **do not force push**: use Option B instead.

## Option B — Repo contains commits/files

```powershell
git clone https://github.com/SelfishKrus/K_MinecraftAgent.git
cd K_MinecraftAgent
git switch -c feature/bedrock-ai-foundation
```

Copy the extracted starter's files into the clone **after reviewing overlapping filenames**. Do **not** copy a `.git` folder or a local `.env`/auth directory.

```powershell
git status
git diff
git add .
git commit -m "Bootstrap Bedrock AI bot and MCP tools"
git push -u origin feature/bedrock-ai-foundation
```

Open a pull request from the newly pushed branch into the repository's default branch. If you lack write permissions, fork the repository and open a PR from your fork.

## Why authentication is needed

Pushing requires a GitHub identity with access to the target repository. A downloaded source archive has no credentials, remote history, or permissions.
