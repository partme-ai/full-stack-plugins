# UI Design and 1Panel release verification

Date: 2026-10-04. Scope: source ownership, repeatable distribution and marketplace version identity; installed-client and production-panel acceptance remain separate.

| Plugin | Manifest/catalog version | Install ref | Plugin commit | Skill source |
|---|---|---|---|---|
| UI Design | 0.1.1 | v0.1.1 | dd570610a27295bc6f9359a33f80127b5a88b9fc | design-skills v1.15.1, 13d8e347002d4be3bb6a5b6415df64fc0a4d52db, 11 skills |
| 1Panel | 0.1.1 | v0.1.1 | 26df70e710069f3e3832e33a9662a594f8c94cce | 1panel-skills v0.1.1, b009fa51c35b41c16464163c49916fe9bcd21caf, 8 skills |

Both local-skill exception inventories are empty. Skill edits belong in the source repositories. Adapted Stitch tooling resolves immutable tags, preserves complete resources and checks content digests; deterministic POSIX path ordering avoids Windows/Linux hash disagreement. Existing source tags were not moved.

Both plugins passed Windows/Linux CI: [UI Design](https://github.com/full-stack-plugins/ui-design-plugin/actions/runs/37142356025), [1Panel](https://github.com/full-stack-plugins/1panel-plugin/actions/runs/37142358864). Local archive relocation passed, including 8 UI plugin tests, 128 Harness regressions, actual bundled browser preview at the three requested viewports, and 17 1Panel tests using a real pinned official server against a simulated endpoint.

Final [UI Design release](https://github.com/full-stack-plugins/ui-design-plugin/releases/tag/v0.1.1) and [1Panel release](https://github.com/full-stack-plugins/1panel-plugin/releases/tag/v0.1.1) include ZIP archives and SHA256 sidecars. The remote marketplace validator confirmed both published Releases and tags. All nine catalog entries passed local consistency checks; three generator regressions cover selected-entry insertion, Windows frontmatter and mismatched-version rejection.

The [marketplace Windows/Linux CI](https://github.com/partme-ai/full-stack-plugins/actions/runs/37142678466) passed against published plugin tags at market commit 35494dee92585c4c01e53a3bfd497e84223d514b. It independently checked release-based installation sources, remote Release identity and generator regressions.

No native image-generation request or production server operation was executed. UI Design ordinary design requires no MCP. 1Panel requires a separately installed official executable and private connection/API configuration; readonly is the default. Native-client loading and variable expansion remain subject to actual user installation verification.
