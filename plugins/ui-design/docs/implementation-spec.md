# UI Design implementation contract

This document is the implementation acceptance source for this new package. It extends the design proposal without initializing a separate SDD tool. No Git branch or client installation is required by this change.

1. Ship a discoverable Agent Plugins 1.0.0 package named `ui-design`, English display name `UI Design`, and Codex/Claude compatibility manifests. No MCP or SessionStart hook is needed for model-native design.
2. Include the nine requested design skills, the new `ui-design-to-image`, and the source-maintained `ui-design-use` entry. Preserve full standalone resources, scripts and licenses. Record complete-skill content hashes and source provenance; never label a dirty source snapshot as a published immutable tag.
3. Route specification, editable frontend, image, preview, review, continuity and resumable work to the corresponding skills. Native image generation is preferred when available; baoyu remains an explicitly selected optional backend. No automatic installation, provider switch or image invocation on load.
4. Existing Harness remains the sole persistent workflow ledger. A runtime entry resolves paths relative to the installed package and a caller-supplied absolute project store. It must not write runs in the plugin directory by accident.
5. Verify package relocation, referenced resources, source hashes and the existing Harness regression suite. Check preview behavior in an available browser. Do not call real images merely to validate packaging.
6. Document model-generated versus rendered frontend evidence, requested logical viewports (390脳884, 768脳1024, 1280脳1024), and actual supported image dimensions. No approval or production-runtime claims from a bitmap alone.
7. Deliver source, repeatable validation, CI and a distributable archive. Publication and user-installed-client validation are separate, recorded statuses.
