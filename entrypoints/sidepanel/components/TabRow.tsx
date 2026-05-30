import { activateTab, sleepTab, type TabView } from '@/src/services/tabs';
import { stashTabs } from '@/src/services/stash-actions';
import { closeTabWithUndo } from '../undo/actions';
import { toggleLock } from '@/src/lock/keep-awake';
import { useListItemDnd } from '../dnd/useListItemDnd';
import { Moon, Tray, Lock, LockOpen, X } from '@phosphor-icons/react';
import { Favicon } from './Favicon';
import styles from './TabRow.module.css';

const STATE_LABEL: Record<TabView['state'], string> = {
  active: 'Active',
  awake: 'Awake',
  asleep: 'Asleep',
};

export function TabRow({ tab, locked }: { tab: TabView; locked: boolean }) {
  // The browser cannot discard the active Tab, an asleep Tab is already
  // discarded, and a Keep-awake-locked Tab is never slept manually.
  const canSleep = tab.state === 'awake' && !locked;
  const { ref, edge, dragging } = useListItemDnd({
    kind: 'open-tab',
    tabId: tab.id,
    index: tab.index,
  });

  return (
    <li
      ref={ref}
      className={styles.row}
      data-state={tab.state}
      data-edge={edge ?? undefined}
      data-dragging={dragging || undefined}
    >
      <Favicon src={tab.favIconUrl} />
      <button
        className={styles.title}
        title={tab.title}
        onClick={() => activateTab(tab.id)}
      >
        {tab.title}
      </button>
      <span className={styles.badge} data-state={tab.state}>
        {STATE_LABEL[tab.state]}
      </span>
      <div className={styles.actions}>
        <button
          className={styles.action}
          data-on={locked || undefined}
          title={locked ? 'Allow sleeping (unlock)' : 'Keep awake (never sleep)'}
          aria-pressed={locked}
          onClick={() => toggleLock(tab.id)}
        >
          {locked ? <Lock size={15} weight="fill" /> : <LockOpen size={15} weight="regular" />}
        </button>
        <button
          className={styles.action}
          title={canSleep ? 'Sleep this tab' : 'Cannot sleep this tab'}
          disabled={!canSleep}
          onClick={() => sleepTab(tab.id)}
        >
          <Moon size={15} weight="regular" />
        </button>
        <button
          className={styles.action}
          title="Stash this tab"
          onClick={() =>
            stashTabs([
              {
                id: tab.id,
                url: tab.url,
                title: tab.title,
                favIconUrl: tab.favIconUrl,
              },
            ])
          }
        >
          <Tray size={15} weight="regular" />
        </button>
        <button
          className={styles.action}
          data-danger
          title="Close this tab"
          onClick={() => closeTabWithUndo(tab)}
        >
          <X size={15} weight="bold" />
        </button>
      </div>
    </li>
  );
}
