# Local verification record

## v0.1.2 entry-description correction (2026-10-06)

The callable entry remains `ui-design-use`; `ui-design` remains the plugin ID. Updated skill frontmatter, host skill metadata, plugin descriptions/default prompts and bilingual invocation examples all identify that distinction. The skills snapshot comes from published design-skills v1.15.3 / 5183e6b6ee92bc8f0f6bdbe594bd63d6c550d9a5. No installed cache was edited and no alias skill was introduced.

Validation: source skill lint/distribution checks (18 skills), strict YAML parsing of the entry frontmatter/host metadata, plugin static/link/snapshot checks, 8 plugin regressions and 128 Harness regressions passed. These are packaging and regression evidence; the original user's design artifacts and live installed-client invocation were not executed in this maintenance task.

Scope: local implementation verification, not installed-client acceptance. Source identity is the exact skills.lock.json snapshot at upstream commit 13d8e347002d4be3bb6a5b6415df64fc0a4d52db; source tag v1.15.1 is published.

| Check | Actual result | What it establishes |
|---|---|---|
| Agent Plugins 1.0.0 static validator | PASS, 11 skills | Portable discovery and manifest/MCP rules checked locally |
| Local Markdown/resource links | PASS | Referenced package files resolve |
| Source snapshot hash check | PASS | Full declared source bytes match the lock |
| Plugin Harness entry tests | PASS, 3 | Absolute external store required; plugin store denied |
| Package snapshot tests | PASS, 2 | Relocated source identity and changed-source detection |
| Bundled Harness regression suite | PASS, 128 | Existing state, dispatch, recovery and authority regressions |
| Existing-browser preview check | PASS | Bundled demo synchronization/independent mode/tab state/private-input non-replay |
| Actual viewports | PASS | Phone iframe 390×884, Pad iframe 768×1024; direct Mobile/Tablet/Desktop browser pages at 390×884, 768×1024, 1280×1024 |

The browser receipt/screenshots are generated under dist/preview-evidence by verify_preview.cjs. The demo is explicitly the bundled sample, not a claimed user-specific UI delivery. Real native image generation and baoyu/API calls were not requested for this packaging validation and were not executed. Model quality, host installation and production frontend integration remain NOT VERIFIED.

These local results were recorded before source publication. Current remote CI status is available in the repository's GitHub Actions page. The distributable archive is generated only after schema, link and snapshot checks. Tagged releases, marketplace addition and installing updates remain separate actions.

Release v0.1.1: all skills are source-managed by design-skills v1.15.1; no plugin-local skill exception. Source-ownership and added-resource drift tests passed. Supported manifests and aggregate marketplace share version 0.1.1 and immutable installation ref v0.1.1. Actual client installation remains unverified.
