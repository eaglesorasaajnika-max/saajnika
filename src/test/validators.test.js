import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidIndianPhone, isValidPincode, isValidCouponCode } from '../utils/validators';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('accepts valid email addresses', () => {
      expect(isValidEmail('kavya.singhania@example.com')).toBe(true);
      expect(isValidEmail('client@saajnika.com')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('kavya@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('isValidIndianPhone', () => {
    it('accepts valid 10-digit Indian numbers starting with 6-9', () => {
      expect(isValidIndianPhone('9876543210')).toBe(true);
      expect(isValidIndianPhone('8123456789')).toBe(true);
      expect(isValidIndianPhone('7000000000')).toBe(true);
      expect(isValidIndianPhone('6999999999')).toBe(true);
    });

    it('rejects invalid numbers', () => {
      expect(isValidIndianPhone('1234567890')).toBe(false);
      expect(isValidIndianPhone('98765')).toBe(false);
      expect(isValidIndianPhone('abcdefghij')).toBe(false);
      expect(isValidIndianPhone('')).toBe(false);
    });
  });

  describe('isValidPincode', () => {
    it('accepts valid 6-digit Indian PIN codes', () => {
      expect(isValidPincode('400001')).toBe(true);
      expect(isValidPincode('110001')).toBe(true);
      expect(isValidPincode('560001')).toBe(true);
    });

    it('rejects invalid PIN codes', () => {
      expect(isValidPincode('012345')).toBe(false);
      expect(isValidPincode('40001')).toBe(false);
      expect(isValidPincode('4000001')).toBe(false);
      expect(isValidPincode('ABCDEF')).toBe(false);
    });
  });

  describe('isValidCouponCode', () => {
    it('accepts alphanumeric voucher codes', () => {
      expect(isValidCouponCode('COUTURE15')).toBe(true);
      expect(isValidCouponCode('FESTIVE-2026')).toBe(true);
    });

    it('rejects short or invalid codes', () => {
      expect(isValidCouponCode('A')).toBe(false);
      expect(isValidCouponCode('')).toBe(false);
    });
  });
});
