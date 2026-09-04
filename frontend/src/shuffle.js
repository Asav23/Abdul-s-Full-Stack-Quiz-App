// Fisher-Yates - uniform, unbiased shuffle. Never use Array.sort(() => Math.random() - 0.5);
// that produces a biased ordering, not a uniform one.
export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
