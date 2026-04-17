import { describe, it, expect } from 'vitest';
import { PLAN_FEATURES, normalizePlan } from '../config/plans.config';

// Test the plan config logic directly (no React rendering needed)

describe('PLAN_FEATURES config', () => {
  it('basic plan blocks products at 100', () => {
    const max = PLAN_FEATURES.basic.maxProducts;
    expect(max).toBe(100);
  });

  it('pro plan allows unlimited products', () => {
    expect(PLAN_FEATURES.pro.maxProducts).toBe('unlimited');
  });

  it('enterprise has all features enabled', () => {
    const f = PLAN_FEATURES.enterprise;
    expect(f.hasAdvancedAnalytics).toBe(true);
    expect(f.hasCustomDomain).toBe(true);
    expect(f.hasCSVImportExport).toBe(true);
    expect(f.hasExtendedMediaStorage).toBe(true);
    expect(f.hasPrioritySupport).toBe(true);
  });

  it('normalizePlan maps unknown values to basic', () => {
    expect(normalizePlan(undefined)).toBe('basic');
    expect(normalizePlan(null)).toBe('basic');
    expect(normalizePlan('free')).toBe('basic');
    expect(normalizePlan('pro')).toBe('pro');
    expect(normalizePlan('enterprise')).toBe('enterprise');
  });
});

describe('canAddMoreProducts logic', () => {
  it('returns false when basic plan reaches 100 products', () => {
    const max = PLAN_FEATURES.basic.maxProducts as number;
    const canAdd = (count: number) => count < max;
    expect(canAdd(99)).toBe(true);
    expect(canAdd(100)).toBe(false);
    expect(canAdd(150)).toBe(false);
  });

  it('returns true for pro regardless of count', () => {
    const max = PLAN_FEATURES.pro.maxProducts;
    const canAdd = (count: number) => max === 'unlimited' || count < (max as number);
    expect(canAdd(1000)).toBe(true);
  });
});
