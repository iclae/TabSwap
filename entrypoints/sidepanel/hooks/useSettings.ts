import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import {
  DEFAULT_SETTINGS,
  getSettings,
  type Settings,
} from '@/src/storage/storage';

/** Live view of persisted settings, kept in sync via storage changes. */
export function useSettings(): Settings {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);

    const listener = (
      changes: Record<string, { newValue?: unknown }>,
      area: string,
    ) => {
      if (area === 'local' && changes.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...(changes.settings.newValue as Partial<Settings>),
        });
      }
    };
    browser.storage.onChanged.addListener(listener);
    return () => browser.storage.onChanged.removeListener(listener);
  }, []);

  return settings;
}
