import type { StashEntry } from '@/src/domain/stash';
import { StashEntryRow } from './StashEntryRow';
import styles from './StashRegion.module.css';

export function StashRegion({ entries }: { entries: StashEntry[] }) {
  return (
    <section className={styles.region}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Stash</h2>
        <span className={styles.count}>{entries.length}</span>
      </header>
      {entries.length === 0 ? (
        <p className={styles.empty}>Nothing stashed yet.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <StashEntryRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
