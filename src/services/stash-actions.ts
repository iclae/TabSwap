// Orchestration for Stash actions: combines Stash domain (pure), Storage, and
// the Tab service. Thin glue — the decision logic lives in the domain module.
import {
  addEntries,
  isStashable,
  removeEntry,
  type StashableTab,
  type StashEntry,
} from '@/src/domain/stash';
import { getStash, setStash } from '@/src/storage/storage';
import { closeTab, openUrl } from './tabs';

export interface ClosableTab extends StashableTab {
  id: number;
}

const newId = () => crypto.randomUUID();

/**
 * Stash the given tabs: persist an entry for each stashable one, then close
 * those real tabs. Unstashable pages are left untouched.
 */
export async function stashTabs(tabs: ClosableTab[]): Promise<void> {
  const current = await getStash();
  const next = addEntries(current, tabs, Date.now(), newId);
  await setStash(next);
  for (const tab of tabs) {
    if (isStashable(tab.url)) await closeTab(tab.id);
  }
}

/** Pop restore: reopen the entry's Tab and remove the entry from the Stash. */
export async function popRestore(entry: StashEntry): Promise<void> {
  await openUrl(entry.url);
  const current = await getStash();
  await setStash(removeEntry(current, entry.id));
}

/** Copy restore: reopen the entry's Tab while keeping the entry in the Stash. */
export async function copyRestore(entry: StashEntry): Promise<void> {
  await openUrl(entry.url);
}
