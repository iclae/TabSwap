// Storage: wraps chrome.storage.local behind a small interface. Both Stash
// entries and settings live here; nothing uses chrome.storage.sync (ADR-0001).
import { browser } from 'wxt/browser';
import type { StashEntry } from '@/src/domain/stash';

const STASH_KEY = 'stash';
const SETTINGS_KEY = 'settings';

export interface Settings {
  /** Auto-sleep idle timeout, in minutes. */
  idleMinutes: number;
  /** Domains exempt from auto-sleep (matched by domain + subdomain). */
  excludedDomains: string[];
  /** Whether the Stash region is collapsed in the side panel. */
  stashCollapsed: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  idleMinutes: 30,
  excludedDomains: [],
  stashCollapsed: false,
};

export async function getStash(): Promise<StashEntry[]> {
  const res = await browser.storage.local.get(STASH_KEY);
  return (res[STASH_KEY] as StashEntry[] | undefined) ?? [];
}

export async function setStash(entries: StashEntry[]): Promise<void> {
  await browser.storage.local.set({ [STASH_KEY]: entries });
}

export async function getSettings(): Promise<Settings> {
  const res = await browser.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(res[SETTINGS_KEY] as Partial<Settings>) };
}

export async function setSettings(patch: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  await browser.storage.local.set({ [SETTINGS_KEY]: { ...current, ...patch } });
}
