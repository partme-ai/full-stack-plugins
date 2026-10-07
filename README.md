<div align="center">

# Full Stack Plugins

**10 个插件。研发全流程。一个统一生态。**

*AI 设计工具 · 图表绘制 · 代码质量 · 流程治理 · 服务器运维 — 面向 Codex / ZCode / Kimi 独立安装。*

[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)
[![Platforms](https://img.shields.io/badge/hosts-Codex%20%C2%B7%20ZCode%20%C2%B7%20Kimi-blue)](#安装)
[![Plugins](https://img.shields.io/badge/plugins-10-green)](#插件目录)

[English](./README.en.md)

[简介](#简介) ·
[生态](#生态) ·
[安装](#安装) ·
[插件目录](#插件目录) ·
[架构](#架构) ·
[贡献](#贡献指南)

</div>

---

## 简介

**Full Stack Plugins** 是面向研发过程的插件市场，覆盖 AI 设计工具、图表绘制、代码检查、语义审查、流程治理与服务器运维，面向 Codex、ZCode 与 Kimi Code 三个宿主平台。

本仓库与技能侧的 [Full Stack Skills](https://github.com/partme-ai/full-stack-skills) 对位：技能侧沉淀「怎么想」的领域知识（框架、架构、测试方法论），插件侧提供「能做到」的可执行能力（MCP 工具、门禁流水线、自动化运维）。两者按同一套领域划分共建同一个生态——Stitch 对应技能侧的 stitch-skills，ProcessOn 对应 processon-skills。

> 本仓库只包含市场元数据（catalog 与三平台清单），不包含插件运行时代码。每个插件在各自独立仓库中维护，通过 `catalog.json` 单一事实源对齐 ID、名称、版本、分类与仓库地址。

### 覆盖领域

| 领域 | 问题 | 解决方案（插件） |
|------|------|------------------|
| **AI 设计工具** | UI 设计稿生成与前端落地 | stitch-design |
| **图表绘制** | 流程图、架构图、思维导图 | processon-design |
| **可执行代码检查** | 规范、静态分析、编译与测试证据 | codeguard |
| **语义代码审查** | 用户授权后审查候选提交的逻辑与安全风险 | codereview-plugin |
| **研发流程治理** | SDD 阶段、证据与提交门禁裁决 | flowguard |
| **Git 工作流治理** | 分支命名、创建基线、提交与发布回灌规范 | gitflow |
| **服务器运维** | 宝塔面板站点 / 数据库 / 计划任务 | bt-linux-panel |

---

## 生态

<!-- ecosystem-navigation:start -->

| 方向 | 适用任务 | 目录与安装 | 组织 |
| --- | --- | --- | --- |
| Full Stack Skills | 软件开发、架构设计、测试与运维 | [PartMe.AI / full-stack-skills](https://github.com/partme-ai/full-stack-skills) | [full-stack-skills](https://github.com/full-stack-skills) |
| Full AIGC Skills | 图像、视频、音频等内容创作 | [PartMe.AI / full-aigc-skills](https://github.com/partme-ai/full-aigc-skills) | [full-aigc-skills](https://github.com/full-aigc-skills) |
| Full Stack Plugins | 研发与运维的工具集成和工作流 | [PartMe.AI / full-stack-plugins](https://github.com/partme-ai/full-stack-plugins) | [full-stack-plugins](https://github.com/full-stack-plugins) |
| Full AIGC Plugins | 内容制作的工具集成和生成工作流 | [PartMe.AI / full-aigc-plugins](https://github.com/partme-ai/full-aigc-plugins) | [full-aigc-plugins](https://github.com/full-aigc-plugins) |

<!-- ecosystem-navigation:end -->

### 相关资源

| 资源 | 链接 |
|------|------|
| **Agent Skills 规范** | [agentskills.io](https://agentskills.io) |
| **Skills CLI** | [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills) |
| **PartMe.AI** | [github.com/partme-ai](https://github.com/partme-ai) |

---

## 安装

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

打开 设置 → 插件 → 创建 → 添加插件市场，输入 `partme-ai/full-stack-plugins`，然后在个人市场分区中安装。

### Kimi Code CLI

```text
/plugins marketplace https://raw.githubusercontent.com/partme-ai/full-stack-plugins/main/kimi-marketplace.json
```

---

## 插件目录

以下为 **全栈开发** 插件；点击插件名称或仓库链接查看各插件文档，另一分类请使用上方市场入口。

| 插件 | ID | 版本 | 定位 | 仓库 |
|------|----|:----:|------|------|
| [**1Panel**](https://github.com/full-stack-plugins/1panel-plugin) | `1panel` | 0.1.1 | Scoped 1Panel operations via official MCP | [1panel-plugin](https://github.com/full-stack-plugins/1panel-plugin) |
| [**BaoTa Linux Panel**](https://github.com/full-stack-plugins/bt-linux-panel-plugin) | `bt-linux-panel` | 1.0.6 | Operate Baota Linux panel via MCP | [bt-linux-panel-plugin](https://github.com/full-stack-plugins/bt-linux-panel-plugin) |
| [**CodeGraph**](https://github.com/full-stack-plugins/codegraph-plugin) | `codegraph` | 0.1.6 | Discoverable codegraph — official prompt + all CLI commands | [codegraph-plugin](https://github.com/full-stack-plugins/codegraph-plugin) |
| [**CodeGuard**](https://github.com/full-stack-plugins/codeguard-plugin) | `codeguard` | 0.18.3 | Trustworthy code checks and Java impact analysis | [codeguard-plugin](https://github.com/full-stack-plugins/codeguard-plugin) |
| [**CodeReview**](https://github.com/full-stack-plugins/codereview-plugin) | `codereview-plugin` | 0.3.0 | Review staged commits with explicit consent | [codereview-plugin](https://github.com/full-stack-plugins/codereview-plugin) |
| [**FlowGuard**](https://github.com/full-stack-plugins/flowguard-plugin) | `flowguard` | 0.4.2 | 智能体 SDD 治理：原生规格、证据与提交门禁 | [flowguard-plugin](https://github.com/full-stack-plugins/flowguard-plugin) |
| [**GitFlow**](https://github.com/full-stack-plugins/gitflow-plugin) | `gitflow` | 0.1.1 | 项目 Git 分支、提交、同步与发布规范治理 | [gitflow-plugin](https://github.com/full-stack-plugins/gitflow-plugin) |
| [**Google Stitch Design**](https://github.com/full-stack-plugins/stitch-design-plugin) | `stitch-design` | 0.9.0 | Design and build with Google Stitch | [stitch-design-plugin](https://github.com/full-stack-plugins/stitch-design-plugin) |
| [**ProcessOn Design**](https://github.com/full-stack-plugins/processon-design-plugin) | `processon-design` | 0.2.12 | Design polished, editable ProcessOn diagrams | [processon-design-plugin](https://github.com/full-stack-plugins/processon-design-plugin) |
| [**UI Design**](https://github.com/full-stack-plugins/ui-design-plugin) | `ui-design` | 0.1.2 | Frontend design via the ui-design-use entry skill | [ui-design-plugin](https://github.com/full-stack-plugins/ui-design-plugin) |

GitFlow v0.1.1 分发独立 `git-skills` 的九技能快照，使用项目规则与确定性 Git 门禁；附带 Git 官方标志衍生 logo。三端市场元数据已对齐，实际宿主安装加载仍未验证。

CodeReview v0.2.1 分发 8 个技能（官方 OCR 2 个、独立 `codereview-skills` 5 个、插件专属 `codereview-harness` 1 个），已通过离线测试；真实 OCR 模型调用和 Codex、ZCode、Kimi 安装加载仍为 **UNVERIFIED**。它的报告是建议，不替代 CodeGuard 检查或 FlowGuard 裁决。

---

## 架构

### 市场如何工作

`catalog.json` 是唯一事实源。`scripts/sync-marketplaces.mjs` 从它生成三平台清单，并校验每个插件仓的 skills 目录（frontmatter、命名一致性）：

```
full-stack-plugins/
├── catalog.json                        # 单一事实源：ID / 名称 / 版本 / 分类 / 仓库
├── .agents/plugins/marketplace.json    # Codex 清单（生成物）
├── marketplace.json                    # ZCode 清单（生成物）
├── kimi-marketplace.json               # Kimi 清单（生成物）
└── scripts/                            # 同步与发版工具
```

每个独立插件仓负责自己的运行时适配：`.codex-plugin/plugin.json`、`.zcode-plugin/plugin.json` 与 `kimi.plugin.json`。

### 渐进式披露

插件内的技能遵循 [Agent Skills 规范](https://agentskills.io)：

1. **启动时**：仅加载技能名称和描述（最小上下文）
2. **按需**：当智能体识别到相关任务时加载完整的 `SKILL.md`
3. **深入**：仅在明确需要时读取参考文件

---

## 贡献指南

### 发版纪律

任何插件代码改动（无论大小）都要 bump + 发版，市场端靠版本号感知更新：

```bash
node scripts/bump-plugin.mjs <plugin-id> <major|minor|patch>
```

该命令会同步更新 catalog 版本、插件仓四个 manifest，并重新生成三平台清单。

### 新增插件

1. 在独立仓库中按三平台适配层构建插件（`.codex-plugin` / `.zcode-plugin` / `kimi.plugin.json`）
2. 在 `catalog.json` 中登记条目
3. 运行 `node scripts/sync-marketplaces.mjs --write` 重新生成清单并提交

---

## 许可证

Apache 2.0 — 详见 [LICENSE](LICENSE)。

---

<div align="center">

**如果这个项目对你有帮助，请给我们一个 ⭐️**

Made with ❤️ by PartMe.AI Team

</div>

## 技能源与新插件

UI Design 的 11 个技能由 design-skills v1.15.1 维护；1Panel 的 8 个技能由 1panel-skills v0.1.1 维护。插件保存完整分发快照，通过版本 tag、commit 和内容摘要锁定来源，不在插件仓库直接维护技能。两个插件均为 v0.1.1。UI Design 普通设计无需 MCP；1Panel 使用前须配置官方 MCP 可执行文件和私有面板连接。
