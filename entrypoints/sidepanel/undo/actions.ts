// Close / Delete wrapped with an undo toast. The destructive action runs
// immediately; the toast only offers to reverse it for a brief window.
import { isStashable, type StashEntry } from '@/src/domain/stash';
import { closeTab, reopenTab, type TabView } from '@/src/services/tabs';
import { deleteStashEntry, restoreStashEntry } from '@/src/services/stash-actions';
import { showUndoToast } from './undoStore';

export async function closeTabWithUndo(tab: TabView): Promise<void> {
  await closeTab(tab.id);
  // Special pages (chrome://, Web Store, blank) can't be reopened by an
  // extension-created tab, so there's nothing to undo to — skip the toast.
  if (!isStashable(tab.url)) return;
  showUndoToast({
    message: `Closed "${tab.title}"`,
    onUndo: () => void reopenTab(tab.url, tab.index),
  });
}

export async function deleteStashEntryWithUndo(entry: StashEntry): Promise<void> {
  await deleteStashEntry(entry.id);
  showUndoToast({
    message: `Deleted "${entry.title}"`,
    onUndo: () => void restoreStashEntry(entry),
  });
}
