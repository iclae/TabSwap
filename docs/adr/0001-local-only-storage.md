# Store all extension data in chrome.storage.local (no sync)

TabSwap keeps both Stash entries and settings entirely in `chrome.storage.local` rather than `chrome.storage.sync`. The Stash is designed to hold large numbers of entries with frequent writes (batch stashing, drag reordering), which would quickly blow past sync's ~100KB total / ~8KB-per-item / write-rate quotas; settings are kept local too for a single, consistent storage layer rather than splitting across backends.

## Consequences

- No cross-device sync: Stash and settings do not follow the user to another device or a reinstall.
- Cross-device sync, if wanted later, should be added as a separate concern (e.g. explicit export/import or a dedicated sync layer) rather than by switching the primary store, since that would require a data migration.
