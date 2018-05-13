import { getIsValidStructId } from '../utils';

describe('getIsValidStructId correctly', () => {
  test('getIsValidStructId is exported', () => {
    expect(typeof getIsValidStructId).toBe('function');
  });
  test('getIsValidStructId returns true on valid struct ids', () => {
    expect(getIsValidStructId('foo')).toBe(true);
    expect(getIsValidStructId(123)).toBe(true);
  });
  test('getIsValidStructId returns false on invalid struct ids', () => {
    expect(getIsValidStructId('')).toBe(false);
    expect(getIsValidStructId(NaN)).toBe(false);
    expect(getIsValidStructId(Infinity)).toBe(false);
    expect(getIsValidStructId(1.23)).toBe(false);
    expect(getIsValidStructId(null)).toBe(false);
    expect(getIsValidStructId(undefined)).toBe(false);
    expect(getIsValidStructId({})).toBe(false);
    expect(getIsValidStructId([])).toBe(false);
    expect(getIsValidStructId(() => {})).toBe(false);
    expect(getIsValidStructId(true)).toBe(false);
    expect(getIsValidStructId(false)).toBe(false);
  });
});
