import { useTabs } from './hooks/useTabs';
import { useStash } from './hooks/useStash';
import { useSettings } from './hooks/useSettings';
import { useLocks } from './hooks/useLocks';
import { useDropMonitor } from './dnd/useDropMonitor';
import { setSettings } from '@/src/storage/storage';
import { Toolbar } from './components/Toolbar';
import { OpenRegion } from './components/OpenRegion';
import { StashRegion } from './components/StashRegion';
import { UndoToast } from './components/UndoToast';
import styles from './App.module.css';

export function App() {
  const tabs = useTabs();
  const stash = useStash();
  const settings = useSettings();
  const lockedIds = useLocks();
  useDropMonitor();

  return (
    <div className={styles.app}>
      <Toolbar />
      <OpenRegion tabs={tabs} lockedIds={lockedIds} />
      <StashRegion
        entries={stash}
        collapsed={settings.stashCollapsed}
        onToggleCollapse={() =>
          setSettings({ stashCollapsed: !settings.stashCollapsed })
        }
      />
      <UndoToast />
    </div>
  );
}
