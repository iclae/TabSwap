import { useEffect, useRef, useState, type RefObject } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { DragData } from './data';

export type ListEdge = 'top' | 'bottom' | null;

/**
 * Wire a list row as both a draggable and a drop target with a top/bottom
 * closest-edge indicator. Pure visual feedback only — nothing is committed
 * here; the central monitor acts on drop (commit-on-drop).
 */
export function useListItemDnd(data: DragData): {
  ref: RefObject<HTMLLIElement | null>;
  edge: ListEdge;
  dragging: boolean;
} {
  const ref = useRef<HTMLLIElement>(null);
  const [edge, setEdge] = useState<ListEdge>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ ...data }),
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      dropTargetForElements({
        element: el,
        // Only same-kind drops show a reorder edge here; cross-region drops
        // target the region container instead.
        canDrop: ({ source }) => source.data.kind === data.kind,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { ...data },
            { input, element, allowedEdges: ['top', 'bottom'] },
          ),
        onDrag: ({ self, source }) => {
          if (source.element === el) {
            setEdge(null);
            return;
          }
          const next = extractClosestEdge(self.data);
          setEdge(next === 'top' || next === 'bottom' ? next : null);
        },
        onDragLeave: () => setEdge(null),
        onDrop: () => setEdge(null),
      }),
    );
    // Re-wire when identity or position changes.
  }, [data.kind, JSON.stringify(data)]);

  return { ref, edge, dragging };
}
