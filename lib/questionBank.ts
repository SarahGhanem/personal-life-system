/**
 * Deterministic pick so the same week always shows the same question, even
 * across reloads or if the question bank grows later. Not a security-sensitive
 * use of randomness — just "same question sticks" for a given week.
 */
export function pickDeterministicIndex(seed: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % count;
}
