// Single-slot, in-memory undo state for Close / Delete. Lives only as long as
// the side panel is open; closing the panel drops any pending undo. A new
// action replaces the current toast, permanently committing the previous one.
import { useSyncExternalStore } from 'react';

export interface UndoToast {
  /** User-facing label, e.g. `Closed "GitHub"`. */
  message: string;
  /** Reverses the action. Runs once, when the user clicks Undo. */
  onUndo: () => void;
}

const DURATION_MS = 8000;

let current: UndoToast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function clear() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  current = null;
}

/** Show an undo toast, replacing (and thereby committing) any current one. */
export function showUndoToast(toast: UndoToast): void {
  clear();
  current = toast;
  timer = setTimeout(() => {
    clear();
    emit();
  }, DURATION_MS);
  emit();
}

/** Run the pending undo and dismiss the toast. */
export function runUndo(): void {
  const toast = current;
  clear();
  emit();
  toast?.onUndo();
}

export function useUndoToast(): UndoToast | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}
