## Why

UI Design and 1Panel repositories exist but cannot be installed from the aggregate marketplace. UI Design also maintains an entry skill locally instead of obtaining every skill from its authoritative source package.

## What Changes

- Move ui-design-use into design-skills; distribute all skills from immutable source releases.
- Supply repeatable vendoring, offline drift checks and supported client manifests.
- Publish plugin v0.1.1 tags and Releases, then register both in the aggregate marketplace with matching versions and pinned logos.

## Capabilities

### New Capabilities

- `source-managed-skills`: plugin snapshots come from versioned skill repositories.

### Modified Capabilities

None. Existing immutable-plugin-installation requirements apply unchanged to the two new entries.

## Impact

design-skills, 1panel-skills, ui-design-plugin, 1panel-plugin and this metadata repository. No installed-cache modifications or real panel operations.
