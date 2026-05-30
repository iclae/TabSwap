# Undo of a Close reopens the URL, not a faithful session restore

The Undo toast for a Close reopens the Tab via `chrome.tabs.create({ url, index, active: true })` rather than `chrome.sessions.restore()`. This keeps undo consistent with the existing Pop restore path (which also just reopens a URL) and avoids adding the `sessions` permission, at the cost of a lossy undo — history, scroll position, and form state are not recovered, only the URL is reopened (at its original tab-strip index). Acceptable because Undo here serves the "I closed the wrong tab" case, where reopening the page is enough.

## Considered Options

- **Rejected: `chrome.sessions.restore()`.** The only way to faithfully restore history, scroll, and position (like Ctrl+Shift+T), but it requires the `sessions` permission and matching the just-closed tab to a `sessionId` via `getRecentlyClosed()`, which races when several tabs are closed in quick succession. The fidelity gain does not justify the new permission and complexity for a short-window undo. Revisit if faithful restore becomes a core need.
