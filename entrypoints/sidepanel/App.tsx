import { useTabs } from './hooks/useTabs';
import { useStash } from './hooks/useStash';
import { OpenRegion } from './components/OpenRegion';
import { StashRegion } from './components/StashRegion';
import styles from './App.module.css';

export function App() {
  const tabs = useTabs();
  const stash = useStash();

  return (
    <div className={styles.app}>
      <OpenRegion tabs={tabs} />
      <StashRegion entries={stash} />
    </div>
  );
}
