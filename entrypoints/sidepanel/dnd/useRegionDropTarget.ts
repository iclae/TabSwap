import { useEffect, useRef, useState, type RefObject } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { DragData } from './data';

/**
 * Make a whole region a drop target for cross-region drags. It only accepts the
 * opposite kind, so it never competes with in-region row reordering.
 */
export function useRegionDropTarget(
  kind: 'open-region' | 'stash-region',
  accepts: DragData['kind'],
): { ref: RefObject<HTMLElement | null>; isOver: boolean } {
  const ref = useRef<HTMLElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.kind === accepts,
      getData: () => ({ kind }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });
  }, [kind, accepts]);

  return { ref, isOver };
}
