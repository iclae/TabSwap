# Frontend and build stack: WXT + React + Pragmatic drag-and-drop

TabSwap is built as a Manifest V3 extension on **WXT** (handles manifest generation, multi-entrypoint wiring, HMR, side panel / background / options), with **React + TypeScript** for UI, **Vitest** (+ `@webext-core/fake-browser`) for testing the pure logic modules against a mocked `chrome.*`, and **CSS Modules** for scoped styling. These are conventional choices for the extension's shape (side panel + service worker + options page + several pure logic modules).

The one deliberate deviation from the obvious path is the drag-and-drop library: we use **Pragmatic drag-and-drop (Atlassian)** rather than the more common React choice, **dnd-kit**.

## Considered Options

- **Chosen: Pragmatic drag-and-drop.** Its model is "nothing changes during the drag; on drop you read the drop target and act," which maps directly onto our required commit-on-drop behavior and cross-region moves (Open region ⇄ Stash region) via monitors. It is tiny (~4.7kb core) and Atlassian-maintained (Jira/Trello/Confluence).
- **Rejected: dnd-kit.** Faster to stand up a sortable list and has built-in keyboard accessibility, but its `useSortable` reorders **live during the drag**, which fights our commit-on-drop requirement, and its multi-container sortable (cross-list moves) is notoriously fiddly. dnd-kit's main advantages (turnkey keyboard a11y, strong touch support) are low-value here: this is a desktop-only Chrome side panel with no touch, and the app is a personal tab manager.

## Consequences

- Pragmatic DnD gives us primitives, not turnkey sortable widgets — we wire up draggable/drop-target/monitor and the reorder-vs-move decision ourselves.
- Keyboard accessibility for drag is not built in and must be implemented by hand if wanted (accepted trade-off for v1).
