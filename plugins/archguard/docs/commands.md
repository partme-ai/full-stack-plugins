# ArchGuard 命令参考

版本：0.1.1 文档 · 状态：仅 v0.1 PoC check

## 命令表

| 命令 | 作用 | 状态 |
|---|---|---|
| archguard install | 接入宿主，不写项目 | 规划 |
| archguard uninstall | 移除宿主接入 | 规划 |
| archguard upgrade | 升级自身 | 规划 |
| archguard version | 版本与协议 | 规划 |
| archguard doctor | 环境与依赖诊断 | 规划 |
| archguard status | 当前项目状态 | 规划 |
| archguard discover | 只读识别项目 | 规划 |
| archguard init | 建项目配置/基线 | 规划 |
| archguard check | 只读门禁 | 已有/规划 |
| archguard report | 读取证据 | 规划 |

完整领域命令：install,uninstall,upgrade,version,doctor,status,discover,init,check,impact,explain,report

## 退出码

0 PASS；1 BLOCK；2 用法/配置错误；3 UNVERIFIED/DESIGN_ONLY；4 内部错误。

## 边界

没有真实执行证据时不得输出 PASS。CodeReview 使用阿里云 OCR 的真实命令，不新增自有 CLI。
