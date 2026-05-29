# Keep-awake lock is session-only, not persisted across restart

The per-Tab Keep-awake lock lives only in memory for the current browser session and is cleared on restart. We deliberately rejected persisting it, because Chrome `tabId`s are reassigned on restart, so persisting requires re-anchoring our own id via a content script writing into page `sessionStorage` — which would need broad `<all_urls>` host permissions, still fails on restricted pages (chrome://, Web Store, PDF) and unreliable session-restore paths, and adds significant lifecycle complexity. The lock expresses a short-term "I'm using this right now" intent, so session lifetime is sufficient.

## Considered Options

- **Rejected: self-generated stable tab id + `sessionStorage` anchoring.** The only viable way to make a lock survive restart, but the cost (host permissions, incomplete coverage, unreliable restore, complexity) far outweighs the value for a short-lived lock. Revisit only if a core feature genuinely needs stable cross-restart tab identity.
