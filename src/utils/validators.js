/**
 * Input validation helpers for e-commerce workflows.
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidIndianPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 && /^[6-9]/.test(digits);
};

export const isValidPincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return false;
  const cleaned = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
};

export const isValidCouponCode = (code) => {
  if (!code || typeof code !== 'string') return false;
  return /^[A-Z0-9_-]{3,20}$/i.test(code.trim());
};
