import { activateTab, sleepTab, type TabView } from '@/src/services/tabs';
import { stashTabs } from '@/src/services/stash-actions';
import styles from './TabRow.module.css';

const STATE_LABEL: Record<TabView['state'], string> = {
  active: 'Active',
  awake: 'Awake',
  asleep: 'Asleep',
};

export function TabRow({ tab }: { tab: TabView }) {
  // The browser cannot discard the active Tab, and an asleep Tab is already
  // discarded — Sleep is unavailable in both cases.
  const canSleep = tab.state === 'awake';

  return (
    <li className={styles.row} data-state={tab.state}>
      <img
        className={styles.favicon}
        src={tab.favIconUrl || undefined}
        alt=""
        aria-hidden
      />
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
      <button
        className={styles.action}
        title={canSleep ? 'Sleep this tab' : 'Cannot sleep this tab'}
        disabled={!canSleep}
        onClick={() => sleepTab(tab.id)}
      >
        💤
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
        📥
      </button>
    </li>
  );
}
