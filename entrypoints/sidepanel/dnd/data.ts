// Drag-and-drop data shapes shared by draggables, drop targets, and the
// central drop monitor. Pragmatic DnD passes plain records, so these are the
// agreed contract for reading `source` / `location` on drop.

// Index signatures keep these assignable to the Record<string, unknown>
// payloads Pragmatic DnD reads on `source.data` / drop target data.
export interface OpenTabDrag {
  [key: string]: unknown;
  kind: 'open-tab';
  tabId: number;
  index: number;
}

export interface StashEntryDrag {
  [key: string]: unknown;
  kind: 'stash-entry';
  entryId: string;
  index: number;
}

export type DragData = OpenTabDrag | StashEntryDrag;

// Drop targets reuse the item shapes above, plus the two region containers
// (used for cross-region drops and dropping past the last item).
export interface OpenRegionDrop {
  kind: 'open-region';
}

export interface StashRegionDrop {
  kind: 'stash-region';
}

export type DropData = DragData | OpenRegionDrop | StashRegionDrop;

export function isOpenTabDrag(data: Record<string, unknown>): data is OpenTabDrag {
  return data.kind === 'open-tab';
}

export function isStashEntryDrag(
  data: Record<string, unknown>,
): data is StashEntryDrag {
  return data.kind === 'stash-entry';
}

/**
 * Final array index after moving an item from `startIndex` to a drop on the
 * item at `targetIndex` from the given edge. Accounts for the source being
 * removed before re-insertion (splice semantics).
 */
export function reorderDestinationIndex(
  startIndex: number,
  targetIndex: number,
  edge: 'top' | 'bottom' | null,
): number {
  let dest = edge === 'bottom' ? targetIndex + 1 : targetIndex;
  if (startIndex < dest) dest -= 1;
  return dest;
}
