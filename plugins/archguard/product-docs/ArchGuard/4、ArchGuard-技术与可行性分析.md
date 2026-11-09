# ArchGuard 技术与可行性分析

> **文档说明**：评估 ArchGuard 当前实现、缺口与风险。
>
> **版本**：V1.0.0
> **最后更新**：2026-10-24

## 1. 当前结论

Rust CLI 与插件桥接完成；缺少 CLI 或契约时返回 PARTIAL

成熟度：PoC

## 2. 已确认事实

- 插件独立仓库：archguard-plugin
- CLI 入口：archguard
- 当前版本：0.1.1
- 命令：version、doctor、discover、status、check

## 3. 主要风险

| 风险 | 影响 | 处理 |
| :--- | :--- | :--- |
| 运行时缺失 | 只能返回 UNVERIFIED/PARTIAL | doctor 明确缺失项 |
| 证据不可回读 | 结论无法审计 | report 读取真实产物 |
| Hook 冲突 | 重复阻断或漏检 | 固定事件所有权 |
| 版本漂移 | 宿主与插件不一致 | 统一版本与 catalog 同步 |

## 4. 可行性结论

- 生命周期与只读命令：✅ 可行。
- 领域判定：PoC，未实现部分必须标注 DESIGN_ONLY。
- 生产接入：需要真实宿主和真实仓库证据后才能声明完成。

---

**文档状态**：✅ 待评审
