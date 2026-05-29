import type { TabView } from '@/src/services/tabs';
import { TabRow } from './TabRow';
import { useRegionDropTarget } from '../dnd/useRegionDropTarget';
import styles from './OpenRegion.module.css';

export function OpenRegion({ tabs }: { tabs: TabView[] }) {
  // Accept Stash entries dropped in to pop-restore them.
  const { ref, isOver } = useRegionDropTarget('open-region', 'stash-entry');

  return (
    <section
      ref={ref}
      className={styles.region}
      data-dropover={isOver || undefined}
    >
      <header className={styles.header}>
        <h2 className={styles.heading}>Open</h2>
        <span className={styles.count}>{tabs.length}</span>
      </header>
      <ul className={styles.list}>
        {tabs.map((tab) => (
          <TabRow key={tab.id} tab={tab} />
        ))}
      </ul>
    </section>
  );
}
