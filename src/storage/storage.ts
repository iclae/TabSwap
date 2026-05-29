// Storage: wraps chrome.storage.local behind a small interface. Both Stash
// entries and settings live here; nothing uses chrome.storage.sync (ADR-0001).
import { browser } from 'wxt/browser';
import type { StashEntry } from '@/src/domain/stash';

const STASH_KEY = 'stash';

export async function getStash(): Promise<StashEntry[]> {
  const res = await browser.storage.local.get(STASH_KEY);
  return (res[STASH_KEY] as StashEntry[] | undefined) ?? [];
}

export async function setStash(entries: StashEntry[]): Promise<void> {
  await browser.storage.local.set({ [STASH_KEY]: entries });
}
