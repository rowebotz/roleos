import { useMemo } from 'react';
export function useContextDensity(text: string, lowSignalPatterns: string[]) {
  return useMemo(() => {
    if (!text) return { score: 0, flags: [] };
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const flags = lowSignalPatterns.filter(pattern =>
      text.toLowerCase().includes(pattern.toLowerCase())
    );
    // Scoring logic:
    // Base: Length of input
    // Penalty: Low signal words
    // Bonus: Specificity (punctuation, numbers, special chars)
    let score = Math.min(words.length * 5, 50); // Length contributes up to 50
    const penalty = flags.length * 15;
    // Explicitly Escaping only necessary special characters for literal matching to satisfy ESLint
    // removed useless escapes for [ and /
    const bonus = (text.match(/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length * 2;
    score = Math.max(0, Math.min(100, score - penalty + bonus));
    return { score, flags };
  }, [text, lowSignalPatterns]);
}