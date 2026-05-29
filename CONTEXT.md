# TabSwap

A Chrome extension whose primary surface is a sidebar for managing browser tabs, centered on two ways of getting tabs out of the way: sleeping them and stashing them.

## Language

**Tab**:
A Chrome browser tab. When unqualified, refers to a real, open tab in a browser window.

**Active tab (当前正在看的 Tab)**:
The single focused/foreground Tab in a window — the one the user is currently looking at. Toolbar one-click operations treat "当前打开 Tab" as exactly this tab and exempt it.
_Avoid_: Current tab, selected tab

**Awake tab (当前已打开的 Tab)**:
A Tab that is loaded in memory and not discarded — the normal, non-slept state.
_Avoid_: Loaded tab

**Asleep tab (休眠中的 Tab)**:
A Tab that has been Slept (discarded) but still occupies a slot in the tab strip.
_Avoid_: Discarded tab, dormant tab

**Sleep (休眠)**:
Releasing a tab's memory via `chrome.tabs.discard()` while leaving it in the tab strip. The tab stays a real Tab; clicking it reloads automatically. TabSwap does not persist anything — the browser manages discarded tabs.
_Avoid_: Discard (use only when referring to the underlying API)

**Stash (暂存)**:
Closing a real Tab and persisting its metadata (URL, title, etc.) into the extension's `chrome.storage`. The tab leaves the tab strip entirely and exists only as a stored entry until restored.
_Avoid_: Save, archive, park

**Open region (当前打开区域)**:
The sidebar region mirroring the real Tabs of the current window only — each shown with its state (active / awake / asleep). Scoped to the single window the side panel belongs to; other windows have their own independent panel.
_Avoid_: Tab list, open tabs panel

**Stash region (Stash 区域)**:
The sidebar region listing all Stash entries as a single flat list (no groups/sessions), shared across the whole extension. Collapsible as one unit. Both single stashes and batch stashes drop their entries into this same flat list. Entries are manually reorderable by drag, so each entry persists an explicit order (not merely sorted by stash time).
_Avoid_: Stash list, archive panel

**Stash entry**:
One stored item in the Stash region, representing a single closed Tab's persisted metadata.
_Avoid_: Stashed tab (it is no longer a Tab)

**Pop restore (弹出式恢复)**:
Reopening a Stash entry's Tab and removing the entry from the Stash. The default restore action.
_Avoid_: Move restore

**Copy restore (复制式恢复)**:
Reopening a Stash entry's Tab while keeping the entry in the Stash. A secondary action (e.g. modifier-click or a dedicated button).
_Avoid_: Duplicate restore

**Auto-sleep (定时休眠)**:
Background rule that Sleeps a Tab after it has gone unviewed for a configured idle timeout (per-tab, based on last-viewed time). Runs across all windows (unlike manual operations, which are scoped to the current window). Always exempts the active tab, pinned tabs, audible tabs, and tabs with unsaved form input, plus any domain on the user's exclusion list (matched by the page domain equalling or being a subdomain of a listed domain).
_Avoid_: Auto-discard, scheduled sleep

**Keep-awake lock (禁止休眠)**:
A per-Tab toggle on the Tab's entry that prevents the Tab from being slept by any path — auto-sleep, manual single-sleep, and one-click sleep-others all skip it. Does not affect stashing. Session-only: held in memory and cleared on browser restart (see ADR-0002). Toggling again returns it to the normal rules.
_Avoid_: Pin (collides with Chrome pinned tabs), freeze
