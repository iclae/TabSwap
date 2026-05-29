import { describe, it, expect } from 'vitest';
import { getStash, setStash } from './storage';
import type { StashEntry } from '@/src/domain/stash';

function entry(id: string, order: number): StashEntry {
  return {
    id,
    url: `https://${id}.com`,
    title: id,
    stashedAt: 1,
    order,
  };
}

describe('storage: stash round-trip', () => {
  it('returns an empty list when nothing is stored', async () => {
    expect(await getStash()).toEqual([]);
  });

  it('persists and reads back stash entries', async () => {
    const entries = [entry('a', 0), entry('b', 1)];
    await setStash(entries);
    expect(await getStash()).toEqual(entries);
  });

  it('overwrites the stored list on subsequent writes', async () => {
    await setStash([entry('a', 0)]);
    await setStash([entry('b', 0), entry('c', 1)]);
    expect((await getStash()).map((e) => e.id)).toEqual(['b', 'c']);
  });
});
