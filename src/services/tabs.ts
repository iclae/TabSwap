// Tab service: thin adapter over chrome.tabs / windows so the UI and background
// talk to one place and tests can mock the browser.
import { browser, type Tabs } from 'wxt/browser';

export type TabState = 'active' | 'awake' | 'asleep';

export interface TabView {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  state: TabState;
  pinned: boolean;
  audible: boolean;
  index: number;
}

export function toView(tab: Tabs.Tab): TabView {
  const url = tab.url || tab.pendingUrl || '';
  const state: TabState = tab.active
    ? 'active'
    : tab.discarded
      ? 'asleep'
      : 'awake';
  return {
    id: tab.id!,
    title: tab.title || url || 'Untitled',
    url,
    favIconUrl: tab.favIconUrl,
    state,
    pinned: tab.pinned,
    audible: tab.audible ?? false,
    index: tab.index,
  };
}

export async function queryCurrentWindowTabs(): Promise<TabView[]> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  return tabs.filter((t) => t.id !== undefined).map(toView);
}

export async function sleepTab(tabId: number): Promise<void> {
  await browser.tabs.discard(tabId);
}

export async function activateTab(tabId: number): Promise<void> {
  await browser.tabs.update(tabId, { active: true });
}

export async function moveTab(tabId: number, index: number): Promise<void> {
  await browser.tabs.move(tabId, { index });
}

export async function closeTab(tabId: number): Promise<void> {
  await browser.tabs.remove(tabId);
}

export async function openUrl(url: string): Promise<void> {
  await browser.tabs.create({ url, active: true });
}

/**
 * Undo of a Close: reopen the URL at its original tab-strip index and focus it.
 * A fresh tab, not a faithful session restore — see ADR-0004. The index is
 * clamped by Chrome if the strip has since shrunk.
 */
export async function reopenTab(url: string, index: number): Promise<void> {
  await browser.tabs.create({ url, index, active: true });
}
