# SpecGuard (需求规格防护)

> 生命周期 CLI 已实现；check 返回 DESIGN_ONLY。

**Version**: 0.1.1 · **License**: Apache-2.0 · **Skills**: 1

[简体中文](README.md)

## Positioning

SpecGuard is an independent plugin in the Partme Guard family. Its command prefix is specguard. It is installed, versioned and executed independently.

## CLI Commands

| Command | Type |
| :--- | :--- |
| version | 独立入口 |
| doctor | 独立入口 |
| status | 独立入口 |
| discover | 独立入口 |
| check | 独立入口 |
| init | 独立入口 |

## Installation

~~~bash
codex plugin marketplace add partme-ai/full-stack-plugins
codex plugin add specguard-plugin@full-stack-plugins
~~~

## Quick Start

~~~bash
specguard version
specguard doctor
specguard status
~~~

## Current Status

生命周期 CLI 已实现；check 返回 DESIGN_ONLY。

No PASS without real execution evidence. Unimplemented capabilities report DESIGN_ONLY or UNVERIFIED.

## Architecture

See product-docs/SpecGuard/ and docs/ for command lifecycle, read-only checks and evidence boundaries.

## Boundaries

- Not merged into a single Partme Guard command.
- Does not replace another Guard's domain decision.
- Does not auto-commit, auto-push or modify user code.

## Verification

~~~bash
python3 -m pytest -q
~~~

## License

Apache-2.0
