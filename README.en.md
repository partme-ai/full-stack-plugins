<div align="center">

# Full Stack Plugins

**10 plugins. The full development process. One unified ecosystem.**

*AI design tooling · Diagramming · Code checks · Workflow governance · Server operations — independently installable on Codex / ZCode / Kimi.*

[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)
[![Platforms](https://img.shields.io/badge/hosts-Codex%20%C2%B7%20ZCode%20%C2%B7%20Kimi-blue)](#install)
[![Plugins](https://img.shields.io/badge/plugins-10-green)](#plugin-catalog)

[简体中文](./README.md)

[About](#about) ·
[Ecosystem](#ecosystem) ·
[Install](#install) ·
[Plugin Catalog](#plugin-catalog) ·
[Architecture](#architecture) ·
[Contributing](#contributing)

</div>

---

## About

**Full Stack Plugins** is the plugin marketplace for the software development process, covering AI design tooling, diagramming, executable code checks, semantic review, workflow governance, and server operations across Codex, ZCode, and Kimi Code.

This repository is the plugin-side counterpart of [Full Stack Skills](https://github.com/partme-ai/full-stack-skills): the skills side captures domain knowledge ("how to think"), while the plugin side ships executable capability ("what you can do") — MCP tools, gate pipelines, and automated operations. Both follow the same domain layout within one ecosystem: Stitch pairs with stitch-skills, ProcessOn with processon-skills.

> This repository contains marketplace metadata only (catalog and per-platform manifests), not plugin runtime code. Each plugin is maintained in its own repository, aligned by `catalog.json` as the single source of truth for IDs, names, versions, categories, and repository addresses.

### Coverage

| Domain | Problem | Solution (plugins) |
|--------|---------|--------------------|
| **AI design tooling** | UI design generation and frontend implementation | stitch-design |
| **Diagramming** | Flowcharts, architecture diagrams, mind maps | processon-design |
| **Executable code checks** | Style, static analysis, builds, and tests | codeguard |
| **Semantic code review** | Review staged changes for logic and security risks with user consent | codereview-plugin |
| **Workflow governance** | SDD stages, evidence, and final commit gates | flowguard |
| **Git workflow governance** | Branch names, creation bases, commit rules, and release backports | gitflow |
| **Server operations** | Baota panel sites / databases / cron jobs | bt-linux-panel |

---

## Ecosystem

<!-- ecosystem-navigation:start -->

| Area | Use it for | Catalog / installation | Organization |
| --- | --- | --- | --- |
| Full Stack Skills | Software development, architecture, testing, and operations | [PartMe.AI / full-stack-skills](https://github.com/partme-ai/full-stack-skills) | [full-stack-skills](https://github.com/full-stack-skills) |
| Full AIGC Skills | Image, video, audio, and other content creation | [PartMe.AI / full-aigc-skills](https://github.com/partme-ai/full-aigc-skills) | [full-aigc-skills](https://github.com/full-aigc-skills) |
| Full Stack Plugins | Tools and workflows for development and operations | [PartMe.AI / full-stack-plugins](https://github.com/partme-ai/full-stack-plugins) | [full-stack-plugins](https://github.com/full-stack-plugins) |
| Full AIGC Plugins | Tools and workflows for content production | [PartMe.AI / full-aigc-plugins](https://github.com/partme-ai/full-aigc-plugins) | [full-aigc-plugins](https://github.com/full-aigc-plugins) |

<!-- ecosystem-navigation:end -->

### Related resources

| Resource | Link |
|----------|------|
| **Agent Skills specification** | [agentskills.io](https://agentskills.io) |
| **Skills CLI** | [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills) |
| **PartMe.AI** | [github.com/partme-ai](https://github.com/partme-ai) |

---

## Install

### Codex

```bash
codex plugin marketplace add partme-ai/full-stack-plugins
codex plugin add bt-linux-panel@full-stack-plugins
codex plugin add codeguard@full-stack-plugins
codex plugin add codereview-plugin@full-stack-plugins
codex plugin add flowguard@full-stack-plugins
codex plugin add gitflow@full-stack-plugins
codex plugin add processon-design@full-stack-plugins
codex plugin add stitch-design@full-stack-plugins
codex plugin add ui-design@full-stack-plugins
codex plugin add 1panel@full-stack-plugins
```

### ZCode

Open Settings → Plugins → Create → Add plugin marketplace, enter `partme-ai/full-stack-plugins`, then install from the personal marketplace section.

### Kimi Code CLI

```text
/plugins marketplace https://raw.githubusercontent.com/partme-ai/full-stack-plugins/main/kimi-marketplace.json
```

---

## Plugin Catalog

The plugins below belong to **Full-stack development**. Open a plugin name or repository link for its documentation; use the marketplace links above for the other category.

| Plugin | ID | Version | Focus | Repository |
|------|----|:----:|------|------|
| [**1Panel**](https://github.com/full-stack-plugins/1panel-plugin) | `1panel` | 0.1.1 | Scoped 1Panel operations via official MCP | [1panel-plugin](https://github.com/full-stack-plugins/1panel-plugin) |
| [**BaoTa Linux Panel**](https://github.com/full-stack-plugins/bt-linux-panel-plugin) | `bt-linux-panel` | 1.0.6 | Operate Baota Linux panel via MCP | [bt-linux-panel-plugin](https://github.com/full-stack-plugins/bt-linux-panel-plugin) |
| [**CodeGraph**](https://github.com/full-stack-plugins/codegraph-plugin) | `codegraph` | 0.1.6 | Discoverable codegraph — official prompt + all CLI commands | [codegraph-plugin](https://github.com/full-stack-plugins/codegraph-plugin) |
| [**CodeGuard**](https://github.com/full-stack-plugins/codeguard-plugin) | `codeguard` | 0.18.3 | Trustworthy code checks and Java impact analysis | [codeguard-plugin](https://github.com/full-stack-plugins/codeguard-plugin) |
| [**CodeReview**](https://github.com/full-stack-plugins/codereview-plugin) | `codereview-plugin` | 0.3.0 | Review staged commits with explicit consent | [codereview-plugin](https://github.com/full-stack-plugins/codereview-plugin) |
| [**FlowGuard**](https://github.com/full-stack-plugins/flowguard-plugin) | `flowguard` | 0.4.2 | 智能体 SDD 治理：原生规格、证据与提交门禁 | [flowguard-plugin](https://github.com/full-stack-plugins/flowguard-plugin) |
| [**GitFlow**](https://github.com/full-stack-plugins/gitflow-plugin) | `gitflow` | 0.2.0 | Project Git branch, commit, sync, and release governance | [gitflow-plugin](https://github.com/full-stack-plugins/gitflow-plugin) |
| [**Google Stitch Design**](https://github.com/full-stack-plugins/stitch-design-plugin) | `stitch-design` | 0.9.0 | Design and build with Google Stitch | [stitch-design-plugin](https://github.com/full-stack-plugins/stitch-design-plugin) |
| [**ProcessOn Design**](https://github.com/full-stack-plugins/processon-design-plugin) | `processon-design` | 0.2.12 | Design polished, editable ProcessOn diagrams | [processon-design-plugin](https://github.com/full-stack-plugins/processon-design-plugin) |
| [**UI Design**](https://github.com/full-stack-plugins/ui-design-plugin) | `ui-design` | 0.1.2 | Frontend design via the ui-design-use entry skill | [ui-design-plugin](https://github.com/full-stack-plugins/ui-design-plugin) |

GitFlow v0.1.5 distributes nine locked skills from `git-skills` with project policies and deterministic Git gates, plus a logo derived from the official Git mark. Marketplace metadata is aligned across three hosts; actual host installation/loading remains unverified.

CodeReview v0.2.1 distributes 8 skills (2 upstream OCR, 5 independent `codereview-skills`, and the plugin-local `codereview-harness`) and has passed offline tests. Real OCR model execution and installation/loading in Codex, ZCode, and Kimi are still **UNVERIFIED**. Its findings are advisory and do not replace CodeGuard checks or FlowGuard decisions.

---

## Architecture

### How the marketplace works

`catalog.json` is the single source of truth. `scripts/sync-marketplaces.mjs` generates the three platform manifests from it and validates each plugin repository's skills directories (frontmatter, naming consistency):

```
full-stack-plugins/
├── catalog.json                        # Single source of truth: IDs / names / versions / categories / repos
├── .agents/plugins/marketplace.json    # Codex manifest (generated)
├── marketplace.json                    # ZCode manifest (generated)
├── kimi-marketplace.json               # Kimi manifest (generated)
└── scripts/                            # Sync and release tooling
```

Each independent plugin repository owns its runtime adapters: `.codex-plugin/plugin.json`, `.zcode-plugin/plugin.json`, and `kimi.plugin.json`.

### Progressive disclosure

Skills inside plugins follow the [Agent Skills specification](https://agentskills.io):

1. **At startup**: only skill names and descriptions are loaded (minimal context)
2. **On demand**: the full `SKILL.md` loads when the agent recognizes a relevant task
3. **In depth**: reference files are read only when explicitly needed

---

## Contributing

### Release discipline

Any plugin code change (no matter the size) requires a version bump and release; marketplaces detect updates by version number:

```bash
node scripts/bump-plugin.mjs <plugin-id> <major|minor|patch>
```

The command updates the catalog version, syncs the four manifests in the plugin repository, and regenerates the three platform manifests.

### Adding a plugin

1. Build the plugin in its own repository with the three-platform adapter layer (`.codex-plugin` / `.zcode-plugin` / `kimi.plugin.json`)
2. Register the entry in `catalog.json`
3. Run `node scripts/sync-marketplaces.mjs --write` to regenerate manifests, then commit

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

<div align="center">

**If this project helps you, please give us a ⭐️**

Made with ❤️ by PartMe.AI Team

</div>

## Skill sources and new plugins

UI Design distributes 11 skills from design-skills v1.15.1; 1Panel distributes 8 from 1panel-skills v0.1.1. Skills are maintained in source repositories and vendored as complete tag/commit/digest-pinned snapshots. Both plugins are v0.1.1. Ordinary UI Design needs no MCP; 1Panel requires an official executable and private panel connection configuration.
