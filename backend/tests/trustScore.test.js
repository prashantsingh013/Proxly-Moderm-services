import {
  calculateResponseTimeScore,
  calculateVerificationBonus,
  calculateAccountAgeScore
} from '../src/services/trustScoreEngine.js';

describe('TrustScore Engine Unit Tests', () => {
  describe('Response Time Scoring', () => {
    it('awards 100 points for rapid response <= 10 mins', () => {
      expect(calculateResponseTimeScore(8)).toBe(100);
      expect(calculateResponseTimeScore(10)).toBe(100);
    });

    it('grades progressively lower for longer response times', () => {
      expect(calculateResponseTimeScore(18)).toBe(90);
      expect(calculateResponseTimeScore(28)).toBe(80);
      expect(calculateResponseTimeScore(45)).toBe(65);
      expect(calculateResponseTimeScore(150)).toBe(30);
    });
  });

  describe('Verification Tier Bonuses', () => {
    it('awards 100 points for Locally Endorsed tier', () => {
      expect(calculateVerificationBonus('Locally Endorsed')).toBe(100);
    });

    it('awards 85 points for Community Verified tier', () => {
      expect(calculateVerificationBonus('Community Verified')).toBe(85);
    });

    it('awards 60 points for Document Verified tier', () => {
      expect(calculateVerificationBonus('Document Verified')).toBe(60);
    });

    it('awards base 20 points for Unverified tier', () => {
      expect(calculateVerificationBonus('Unverified')).toBe(20);
    });
  });

  describe('Account Age Scoring', () => {
    it('scales linearly up to 180 days and caps at 100', () => {
      const now = Date.now();
      const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
      const twoHundredDaysAgo = new Date(now - 200 * 24 * 60 * 60 * 1000);

      expect(calculateAccountAgeScore(ninetyDaysAgo)).toBe(50);
      expect(calculateAccountAgeScore(twoHundredDaysAgo)).toBe(100);
    });
  });
});
