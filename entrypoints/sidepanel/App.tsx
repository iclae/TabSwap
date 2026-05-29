import { useTabs } from './hooks/useTabs';
import { useStash } from './hooks/useStash';
import { useSettings } from './hooks/useSettings';
import { useDropMonitor } from './dnd/useDropMonitor';
import { setSettings } from '@/src/storage/storage';
import { OpenRegion } from './components/OpenRegion';
import { StashRegion } from './components/StashRegion';
import styles from './App.module.css';

export function App() {
  const tabs = useTabs();
  const stash = useStash();
  const settings = useSettings();
  useDropMonitor();

  return (
    <div className={styles.app}>
      <OpenRegion tabs={tabs} />
      <StashRegion
        entries={stash}
        collapsed={settings.stashCollapsed}
        onToggleCollapse={() =>
          setSettings({ stashCollapsed: !settings.stashCollapsed })
        }
      />
    </div>
  );
}
