// lib/match.test.ts
import { matchInsured } from './match';

describe('matchInsured', () => {
  it('matches a known insured', () => {
    const result = matchInsured('Riley HealthCare LLC');
    expect(result.internalId).toBe('A1B2');
  });
});
