import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { isOpenTabDrag, reorderDestinationIndex } from './data';
import { moveTab } from '@/src/services/tabs';

function edgeOf(data: Record<string, unknown>): 'top' | 'bottom' | null {
  const e = extractClosestEdge(data);
  return e === 'top' || e === 'bottom' ? e : null;
}

/**
 * Single commit-on-drop monitor for all drag interactions. Nothing changes
 * during a drag; on drop the drop target decides the action.
 */
export function useDropMonitor() {
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const src = source.data;
        const dst = target.data;

        // Reorder within the Open region -> move the real Tab.
        if (isOpenTabDrag(src) && isOpenTabDrag(dst)) {
          const dest = reorderDestinationIndex(src.index, dst.index, edgeOf(dst));
          if (dest !== src.index) moveTab(src.tabId, dest);
          return;
        }
      },
    });
  }, []);
}
