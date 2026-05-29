import type { StashEntry } from '@/src/domain/stash';
import { copyRestore, popRestore } from '@/src/services/stash-actions';
import { useListItemDnd } from '../dnd/useListItemDnd';
import styles from './StashEntryRow.module.css';

export function StashEntryRow({
  entry,
  index,
}: {
  entry: StashEntry;
  index: number;
}) {
  const { ref, edge, dragging } = useListItemDnd({
    kind: 'stash-entry',
    entryId: entry.id,
    index,
  });

  return (
    <li
      ref={ref}
      className={styles.row}
      data-edge={edge ?? undefined}
      data-dragging={dragging || undefined}
    >
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
