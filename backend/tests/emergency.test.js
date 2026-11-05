import { calculateEmergencySurcharge } from '../src/services/emergencyEngine.js';

describe('Emergency Mode Engine Unit Tests', () => {
  describe('Emergency Surcharge Transparency', () => {
    it('computes transparent flat fee and base cost upfront', () => {
      const estimate = calculateEmergencySurcharge(500);

      expect(estimate.baseAmount).toBe(500);
      expect(estimate.flatFee).toBe(150);
      expect(estimate.breakdowns.length).toBeGreaterThanOrEqual(1);
      expect(estimate.totalEstimatedCost).toBeGreaterThanOrEqual(650);
      expect(estimate.transparencyNotice).toContain('zero surprise add-ons');
    });
  });
});
