import { ArrowUUpLeft } from '@phosphor-icons/react';
import { runUndo, useUndoToast } from '../undo/undoStore';
import styles from './UndoToast.module.css';

export function UndoToast() {
  const toast = useUndoToast();
  if (!toast) return null;

  return (
    <div className={styles.toast} role="status">
      <span className={styles.message} title={toast.message}>
        {toast.message}
      </span>
      <button className={styles.undo} onClick={runUndo}>
        <ArrowUUpLeft size={13} weight="regular" />
        Undo
      </button>
    </div>
  );
}
