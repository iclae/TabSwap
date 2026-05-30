import { useState } from 'react';
import { Globe } from '@phosphor-icons/react';
import styles from './Favicon.module.css';

// An empty <img> with no favicon renders as a bare bordered box that reads
// like a to-do checkbox next to the title. Fall back to a round globe glyph
// so a page without a favicon still looks like a page, not a checkbox.
export function Favicon({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className={styles.fallback} aria-hidden>
        <Globe size={14} weight="regular" />
      </span>
    );
  }

  return (
    <img
      className={styles.favicon}
      src={src}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
    />
  );
}
