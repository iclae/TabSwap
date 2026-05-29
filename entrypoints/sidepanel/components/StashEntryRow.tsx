import type { StashEntry } from '@/src/domain/stash';
import { copyRestore, popRestore } from '@/src/services/stash-actions';
import styles from './StashEntryRow.module.css';

export function StashEntryRow({ entry }: { entry: StashEntry }) {
  return (
    <li className={styles.row}>
      <img
        className={styles.favicon}
        src={entry.favIconUrl || undefined}
        alt=""
        aria-hidden
      />
      <button
        className={styles.title}
        title={`Pop restore — ${entry.url}`}
        onClick={() => popRestore(entry)}
      >
        {entry.title}
      </button>
      <button
        className={styles.action}
        title="Copy restore (reopen, keep in stash)"
        onClick={() => copyRestore(entry)}
      >
        📋
      </button>
    </li>
  );
}
