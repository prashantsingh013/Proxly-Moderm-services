import { calculateDistanceKm } from '../src/services/smartMatchEngine.js';

describe('SmartMatch Engine Unit Tests', () => {
  describe('Haversine Geospatial Distance Calculation', () => {
    it('accurately calculates distance between Indiranagar and Koramangala (~5-6 km)', () => {
      const indiranagar = [77.6408, 12.9784];
      const koramangala = [77.6271, 12.9352];

      const distance = calculateDistanceKm(indiranagar, koramangala);
      expect(distance).toBeGreaterThan(4);
      expect(distance).toBeLessThan(7);
    });

    it('returns 0 for identical coordinates', () => {
      const point = [77.6408, 12.9784];
      expect(calculateDistanceKm(point, point)).toBe(0);
    });
  });
});
