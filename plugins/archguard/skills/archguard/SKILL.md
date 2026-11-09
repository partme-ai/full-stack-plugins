---
name: archguard
description: 当用户需要提取架构事实、校验依赖契约、输出违规证据；没有真实 CLI 时报告 DESIGN_ONLY。时使用；先只读检查，再执行可核验步骤，不把设计文档当成已运行实现。
---

# ArchGuard（架构边界防护）

把模块依赖、分层与边界约束变成可执行门禁。

## 使用顺序

1. 识别目标仓库、事实源和当前可用工具。
2. 有真实 CLI 时执行并保留证据。
3. 工具未实现或不可用时报告 DESIGN_ONLY / NOT_RUN，不报 PASS。
4. 输出交给 GuardEngine、FlowGuard 或独立 CI。

## 边界

- 不替代其他专业 Guard。
- 不伪造门禁通过。
- 语义不确定时交人工复核。
