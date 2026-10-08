import { describe, it, expect } from 'vitest';
import { formatINR, formatDate, formatDateTime, formatPhoneNumber, slugify } from '../utils/formatters';

describe('formatters', () => {
  describe('formatINR', () => {
    it('formats Indian Rupee currency with standard symbol', () => {
      const formatted = formatINR(145000);
      expect(formatted).toContain('1,45,000');
      expect(formatted).toContain('₹');
    });

    it('handles zero and null values gracefully', () => {
      expect(formatINR(0)).toBe('₹0');
      expect(formatINR(null)).toBe('₹0');
      expect(formatINR(undefined)).toBe('₹0');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10 digit Indian numbers', () => {
      expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
    });

    it('returns raw string for non-standard inputs', () => {
      expect(formatPhoneNumber('')).toBe('');
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('slugify', () => {
    it('converts title to clean URL slug', () => {
      expect(slugify('Banarasi Silk Saree & Choli')).toBe('banarasi-silk-saree-choli');
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO dates', () => {
      const res = formatDate('2026-10-08T10:00:00Z');
      expect(res).toBeTruthy();
      expect(typeof res).toBe('string');
    });

    it('returns fallback for empty string', () => {
      expect(formatDate('')).toBe('—');
    });
  });
});
