import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { sortByOrder, type StashEntry } from '@/src/domain/stash';
import { getStash } from '@/src/storage/storage';

/** Live, order-sorted view of the Stash, kept in sync via storage changes. */
export function useStash(): StashEntry[] {
  const [entries, setEntries] = useState<StashEntry[]>([]);

  useEffect(() => {
    getStash().then((e) => setEntries(sortByOrder(e))).catch(console.error);

    const listener = (
      changes: Record<string, { newValue?: unknown }>,
      area: string,
    ) => {
      if (area === 'local' && changes.stash) {
        setEntries(sortByOrder((changes.stash.newValue as StashEntry[]) ?? []));
      }
    };
    browser.storage.onChanged.addListener(listener);
    return () => browser.storage.onChanged.removeListener(listener);
  }, []);

  return entries;
}
