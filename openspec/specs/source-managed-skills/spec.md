# source-managed-skills Specification

## Purpose
Keep UI Design and 1Panel skill content owned by their dedicated skill repositories while distributing complete, reproducible plugin snapshots that remain usable without runtime source downloads.

## Requirements

### Requirement: Skills are maintained in source repositories

Plugins MUST obtain distributed skills from an immutable, publicly available source release and MUST record its resolved commit and content hashes. These two plugins MUST NOT maintain local skill exceptions.

#### Scenario: UI routing skill is changed
- **WHEN** ui-design-use needs an update
- **THEN** the change is made in design-skills and the plugin receives a deliberate release snapshot update

#### Scenario: Installed package needs no source checkout
- **WHEN** a user installs a published plugin
- **THEN** its skill resources are complete and no source repository download is required at runtime

### Requirement: Snapshot drift is detected

The plugin MUST provide offline hash verification and repeatable tag-based update and upstream verification commands.

#### Scenario: Vendored skill is edited locally
- **WHEN** the content differs from its pinned source
- **THEN** verification fails without silently rewriting files
