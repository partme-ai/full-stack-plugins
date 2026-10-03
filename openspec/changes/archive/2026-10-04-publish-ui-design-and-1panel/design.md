## Context

Use the existing Stitch vendoring tool and immutable-marketplace model. Marketplace metadata remains here; runtime and complete installable skill snapshots remain in independent plugin repositories.

## Goals / Non-Goals

All distributed skills have source ownership. Both plugins are discoverable at consistent fixed versions. Do not install clients, copy a GPL server into the package or claim live-panel acceptance.

## Decisions

Move ui-design-use to design-skills and register it in bilingual catalogs. Reuse skill_vendor.py with canonical Git checkout bytes and immutable source tag/commit/digests. Both plugin-local inventories are empty. Preserve complete self-contained resources. Publish v0.1.1 plugins, supply Codex/ZCode/Kimi and single-plugin marketplace manifests, and generate aggregate manifests through the existing generator. Add a public GitHub API fallback for remote Release checks when gh is absent; no tool installation is needed.

## Risks / Trade-offs

Image backends and panel credentials remain prerequisites. Native-client variable expansion remains unverified. Version consistency and CI do not establish real service provisioning or installed-client acceptance.

## Migration Plan

Commit and publish source releases first, vendor and test the plugin snapshots, publish plugins and archives, then publish generated market metadata. Never move an existing release tag.
