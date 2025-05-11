// lib/match.ts
import { INSUREDS } from './insureds';
import levenshtein from 'js-levenshtein';

const CORPORATE_SUFFIXES = ['inc', 'llc', 'corp', 'co', 'ltd'];

//  To calculate confidence value between two strings
export function similarity(a: string, b: string): number {
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  const distance = levenshtein(a, b);
  return (maxLength - distance) / maxLength;
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.,]/g, '')
    .split(' ')
    .filter(word => !CORPORATE_SUFFIXES.includes(word))
    .join(' ')
    .trim();
}

export function matchInsured(name: string): { internalId: string | null; confidence: number } {
  const normalizedInput = normalizeName(name);

  let bestMatch: string | null = null;
  let bestScore = Infinity;
  let matchedId: string | null = null;

  for (const insured of INSUREDS) {
    const normalizedInsured = normalizeName(insured.name);
    const distance = levenshtein(normalizedInput, normalizedInsured);

    if (distance < bestScore) {
      bestScore = distance;
      bestMatch = insured.name;
      matchedId = insured.internalId;
    }
  }

  const confidence = bestMatch
    ? 1 - bestScore / Math.max(normalizedInput.length, bestMatch.length)
    : 0;

  return confidence >= 0.8
    ? { internalId: matchedId, confidence }
    : { internalId: null, confidence };
}