import { classifyIssueWithRules } from '../src/services/aiClassifierEngine.js';

describe('AI & Rule-Based Classifier Unit Tests', () => {
  describe('Rule-Based Issue Classifier & Fallback', () => {
    it('correctly classifies high urgency electrical sparks as emergency', () => {
      const result = classifyIssueWithRules('My switchboard is sparking with smoke and burning smell in living room');

      expect(result.category).toBe('Electrician');
      expect(result.isEmergency).toBe(true);
      expect(result.urgencyLevel).toBe(5);
      expect(result.classifiedBy).toBe('rules');
      expect(result.recommendedAction).toContain('Turn off main MCB');
    });

    it('correctly classifies routine plumbing issue with moderate urgency', () => {
      const result = classifyIssueWithRules('Bathroom tap is dripping and needs a washer replacement');

      expect(result.category).toBe('Plumber');
      expect(result.isEmergency).toBe(false);
      expect(result.urgencyLevel).toBeLessThan(4);
      expect(result.classifiedBy).toBe('rules');
    });

    it('correctly identifies AC cooling diagnostics', () => {
      const result = classifyIssueWithRules('Split AC is not cooling and needs seasonal gas checkup');

      expect(result.category).toBe('Air Conditioner');
      expect(result.suggestedSkills).toContain('Gas Charging');
      expect(result.classifiedBy).toBe('rules');
    });
  });
});
