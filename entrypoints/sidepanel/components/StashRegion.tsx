import type { StashEntry } from '@/src/domain/stash';
import { StashEntryRow } from './StashEntryRow';
import styles from './StashRegion.module.css';

export function StashRegion({
  entries,
  collapsed,
  onToggleCollapse,
}: {
  entries: StashEntry[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <section className={styles.region}>
      <header className={styles.header}>
        <button
          className={styles.toggle}
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand stash' : 'Collapse stash'}
        >
          {collapsed ? '▸' : '▾'}
        </button>
        <h2 className={styles.heading}>Stash</h2>
        <span className={styles.count}>{entries.length}</span>
      </header>
      {!collapsed &&
        (entries.length === 0 ? (
          <p className={styles.empty}>Nothing stashed yet.</p>
        ) : (
          <ul className={styles.list}>
            {entries.map((entry) => (
              <StashEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        ))}
    </section>
  );
}
