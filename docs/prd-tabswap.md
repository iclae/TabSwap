# PRD: TabSwap — sidebar tab manager (Sleep + Stash)

## Problem Statement

People accumulate large numbers of open browser tabs. Most stay open "just in case" but consume memory and clutter the tab strip, while the few tabs actually in use get lost in the crowd. Users want a low-friction way to (a) reclaim memory from tabs they aren't looking at without losing them, and (b) clear tabs off the strip entirely yet keep them retrievable — all without leaving their current window.

## Solution

TabSwap is a Chrome extension whose primary surface is a side panel (sidebar) for managing tabs. It offers two distinct moves:

- **Sleep (休眠):** release a Tab's memory via the browser's discard mechanism while leaving it in the tab strip — it stays a real Tab and reloads when clicked.
- **Stash (暂存):** close a Tab and persist its metadata to extension storage, removing it from the tab strip until the user restores it.

The sidebar shows the current window's Tabs (with their state — active / awake / asleep), a flat list of Stash entries, and a toolbar for bulk actions. A background rule (Auto-sleep) sleeps unviewed Tabs across all windows after an idle timeout, with per-domain exclusions and a per-Tab Keep-awake lock.

Terminology in this PRD follows the project glossary in `CONTEXT.md`; storage and lock-persistence decisions follow `docs/adr/0001-local-only-storage.md` and `docs/adr/0002-session-only-keep-awake-lock.md`.

## User Stories

1. As a user, I want a sidebar (side panel) that lists the Tabs of my current window, so that I can manage them without leaving the window I'm in.
2. As a user, I want each Tab in the Open region shown with its state (active / awake / asleep), so that I can tell at a glance which Tabs are using memory.
3. As a user, I want to Sleep a single Tab from a button on its entry, so that I can free its memory while keeping it in the tab strip.
4. As a user, I want to Stash a single Tab from a button on its entry, so that I can clear it off the tab strip but get it back later.
5. As a user, I want the Sleep button disabled on my active Tab, so that I'm not offered an action the browser can't perform on the Tab I'm looking at.
6. As a user, I want to Stash my active Tab, so that I can put away the page I'm on and move to something else.
7. As a user, I want to drag Tabs within the Open region to reorder them, so that my tab strip order updates to match.
8. As a user, I want to drag a Tab from the Open region into the Stash region, so that I can Stash it by dragging.
9. As a user, I want my Stash entries listed as a single flat list, so that everything I've put away is in one predictable place.
10. As a user, I want to drag Stash entries to reorder them, so that I can arrange my stash however I like, and have that order persist.
11. As a user, I want pop restore (the default) to reopen a Stash entry's Tab and remove the entry, so that finished items leave the stash automatically.
12. As a user, I want copy restore as a secondary action that reopens the Tab but keeps the entry, so that I can revisit a reference page without losing it from the stash.
13. As a user, I want to drag a Stash entry back into the Open region to pop-restore it, so that restoring feels as direct as dragging.
14. As a user, I want to collapse the Stash region, so that I can hide it when I'm focused on open Tabs.
15. As a user, I want a toolbar button to Sleep every Tab in the current window except the active one, so that I can reclaim memory in bulk in one click.
16. As a user, I want a toolbar button to Stash every Tab in the current window except the active one, so that I can clear the strip in bulk in one click.
17. As a user, I want one-click operations to skip pinned Tabs, so that my long-lived pinned Tabs are never swept away.
18. As a user, I want one-click operations to skip special / unrestorable pages (chrome://, Web Store, blank new tabs, etc.), so that my stash never fills with dead entries.
19. As a user, I want one-click Stash to also stash Tabs that are already asleep, so that bulk-clearing catches everything I meant to put away.
20. As a user, I want Auto-sleep to sleep Tabs I haven't viewed for a configurable idle timeout, so that forgotten Tabs stop using memory on their own.
21. As a user, I want Auto-sleep to run across all my windows, so that forgotten Tabs in background windows get reclaimed too.
22. As a user, I want Auto-sleep to never touch my active Tab, pinned Tabs, or audible Tabs, so that it never disrupts something I care about.
23. As a user, I want to configure a list of domains excluded from Auto-sleep, so that sites like my mail or music are never auto-slept.
24. As a user, I want a quick way to add the current Tab's domain to the exclusion list, so that excluding a site takes one action.
25. As a user, I want a per-Tab Keep-awake lock toggle, so that I can guarantee a specific Tab stays awake right now.
26. As a user, I want the Keep-awake lock to block every form of sleeping (auto, manual, one-click), so that a locked Tab is reliably never slept.
27. As a user, I want my Stash entries to persist across browser restarts, so that I don't lose what I've put away.
28. As a user, I want my settings (idle timeout, excluded domains, Stash region collapsed state) to persist, so that I configure them once.
29. As a user, I want allowed duplicate Stash entries (the same URL stashed twice produces two entries), so that no stash action is silently dropped.

## Implementation Decisions

**Platform & stack**
- Manifest V3 Chrome extension. Primary surface is the Side Panel API (requires Chrome 114+). The Open region is scoped to the side panel's own window; manual operations (Open region, drag, one-click toolbar) act on the current window only.
- Built on WXT + React + TypeScript, Vitest (+ `@webext-core/fake-browser`) for tests, CSS Modules for styling, and Pragmatic drag-and-drop for all drag interactions (ADR-0003).
- Drag interactions are commit-on-drop: nothing changes during a drag; on drop, the drop location decides between an in-region reorder and a cross-region move.

**Modules** (build):
- **Sleep policy** (deep, pure): given a Tab's state — active / pinned / audible / Keep-awake-locked / domain-on-exclusion-list / idle time — decides whether the Tab is eligible for Auto-sleep. Includes domain-matching sub-logic (page domain equals or is a subdomain of a listed domain). No Chrome API access.
- **Stash domain** (deep, pure): list operations — add entries (allow duplicates, skip unstashable pages), maintain an explicit persisted order field, and the semantics of pop restore (reopen + remove) vs copy restore (reopen + keep). No Chrome API access.
- **Storage** (deep): wraps `chrome.storage.local` behind a simple interface (`getStash / addEntries / removeEntry / reorder / getSettings / setSettings`). Both Stash entries and settings live in `chrome.storage.local`; nothing uses `chrome.storage.sync` (ADR-0001).
- **Tab service** (thin adapter): wraps `chrome.tabs` / `chrome.windows` / `chrome.sidePanel` (query, discard, move, create, remove) so the logic modules can be tested against a mock.
- **Background service worker**: the Auto-sleep engine — listens to tab/window events, reads each Tab's `lastAccessed`, and applies Sleep policy across all windows on an interval.
- **Side panel UI**: renders the Open region, Stash region, and toolbar; handles drag interactions.
- **Keep-awake lock registry** (in-memory): a session-only map of locked tab ids, cleared on browser restart (ADR-0002). No persistence; deliberately does not use a self-generated tab id + sessionStorage anchoring scheme.

**Key interactions / rules**
- Sleep = `chrome.tabs.discard()` (Tab stays in strip); Stash = close Tab + persist metadata, removing it from the strip.
- Reordering in the Open region calls `chrome.tabs.move` so the side panel stays a faithful mirror of the real tab strip (no independent ordering).
- Dragging a Stash entry into the Open region is equivalent to pop restore.
- "当前打开 Tab" in the toolbar means exactly the active Tab; one-click operations exempt it and pinned Tabs, skip special/unrestorable pages, and one-click Stash also stashes already-asleep Tabs. One-click operations are current-window only.
- The Sleep button is disabled on the active Tab (the browser cannot discard the active Tab); the active Tab can still be stashed.
- The Keep-awake lock blocks auto-sleep, manual single-sleep, and one-click sleep-others; it does not affect stashing.
- Auto-sleep runs across all windows; manual operations are current-window only.
- Auto-sleep idle timing reads Chrome's per-Tab `lastAccessed`; no self-tracked timers are persisted.

**Schema (Stash entry):** persisted metadata captured at stash time — URL, title, favicon, stashedAt timestamp, and an explicit order value. Stored as a flat list in `chrome.storage.local`. Duplicates allowed.

## Testing Decisions

- Good tests assert external behavior, not implementation details. The pure logic modules expose plain inputs → outputs and are the prime test targets.
- **Sleep policy** is tested directly: table-driven cases over the exemption matrix (active, pinned, audible, locked, excluded-domain, idle-vs-not) and the domain-matching rule (exact domain, subdomain, non-match).
- **Stash domain** is tested directly: add allows duplicates, add skips unstashable pages, ordering field is maintained on reorder, pop restore removes the entry, copy restore keeps it.
- **Storage** is tested against a mocked `chrome.storage.local`, asserting round-trips for stash entries and settings.
- Tab service, the background service worker, and the side panel UI are verified manually / via integration rather than unit tests in v1.
- Prior art: none yet — this is a greenfield repo; these are the first tests.

## Out of Scope

- Multi-window aggregate view in the Open region (v1 is current-window only).
- Grouped / session-based Stash (v1 is a single flat list).
- Cross-device sync of Stash or settings, and export/import (ADR-0001 keeps everything local).
- Persisting the Keep-awake lock across browser restart (ADR-0002).
- Wildcard / pattern-based domain exclusions (v1 matches by domain + subdomain only).
- Saving page scroll position, form state, or other live Tab state when stashing (only metadata is captured).
- Exempting Tabs with unsaved form input from Auto-sleep — would require a broad `<all_urls>` content script; dropped from v1.
- Browsers other than Chrome.

## Further Notes

- Deferred defaults to settle at implementation time, not design-blocking: the default Auto-sleep idle timeout value (e.g. 30 min), and the exact reopen position for pop/copy restore (e.g. end of the current window).
- Glossary lives in `CONTEXT.md`; decision records in `docs/adr/`.
