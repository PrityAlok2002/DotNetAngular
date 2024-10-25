import { Price } from './price.model';

describe('Price Interface', () => {
  it('should create a valid Price object', () => {
    const price: Price = {
      priceId: 1,
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    expect(price.priceId).toBe(1);
    expect(price.currency).toBe('USD');
    expect(price.discountPercentage).toBe(10);
    expect(price.effectivePrice).toBe(90);
    expect(price.priceAmount).toBe(100);
    expect(price.productId).toBe(123);
    expect(price.vendorId).toBe(456);
  });

  it('should not allow missing fields', () => {
    // This test case is to demonstrate TypeScript's type-checking, which would fail during compilation.
    // Uncommenting the following line should result in a compilation error.
    // const price: Price = { currency: 'USD', discountPercentage: 10, effectivePrice: 90, priceAmount: 100, productId: 123 };

    // Instead, you can use TypeScript's `Partial` utility type to test missing fields
    const partialPrice: Partial<Price> = {
      currency: 'USD',
      discountPercentage: 10
    };

    expect(partialPrice.currency).toBe('USD');
    expect(partialPrice.discountPercentage).toBe(10);
    expect(partialPrice.effectivePrice).toBeUndefined();
    expect(partialPrice.priceAmount).toBeUndefined();
    expect(partialPrice.productId).toBeUndefined();
    expect(partialPrice.vendorId).toBeUndefined();
  });

  it('should allow additional fields and ignore them', () => {
    const price = {
      priceId: 1,
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 123,
      vendorId: 456,
      additionalField: 'extra'
    } as Price & { additionalField: string };

    expect(price.priceId).toBe(1);
    expect(price.currency).toBe('USD');
    expect(price.discountPercentage).toBe(10);
    expect(price.effectivePrice).toBe(90);
    expect(price.priceAmount).toBe(100);
    expect(price.productId).toBe(123);
    expect(price.vendorId).toBe(456);
    expect(price.additionalField).toBe('extra');
  });

  it('should handle zero values correctly', () => {
    const zeroPrice: Price = {
      priceId: 0,
      currency: 'USD',
      discountPercentage: 0,
      effectivePrice: 0,
      priceAmount: 0,
      productId: 0,
      vendorId: 0
    };

    expect(zeroPrice.priceId).toBe(0);
    expect(zeroPrice.currency).toBe('USD');
    expect(zeroPrice.discountPercentage).toBe(0);
    expect(zeroPrice.effectivePrice).toBe(0);
    expect(zeroPrice.priceAmount).toBe(0);
    expect(zeroPrice.productId).toBe(0);
    expect(zeroPrice.vendorId).toBe(0);
  });

  it('should handle large values correctly', () => {
    const largeValuePrice: Price = {
      priceId: 123456789,
      currency: 'USD',
      discountPercentage: 50,
      effectivePrice: 5000,
      priceAmount: 10000,
      productId: 999999999,
      vendorId: 888888888
    };

    expect(largeValuePrice.priceId).toBe(123456789);
    expect(largeValuePrice.currency).toBe('USD');
    expect(largeValuePrice.discountPercentage).toBe(50);
    expect(largeValuePrice.effectivePrice).toBe(5000);
    expect(largeValuePrice.priceAmount).toBe(10000);
    expect(largeValuePrice.productId).toBe(999999999);
    expect(largeValuePrice.vendorId).toBe(888888888);
  });

  it('should handle special characters in currency', () => {
    const specialCharPrice: Price = {
      priceId: 1,
      currency: '@$%',
      discountPercentage: 15,
      effectivePrice: 85,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    expect(specialCharPrice.priceId).toBe(1);
    expect(specialCharPrice.currency).toBe('@$%');
    expect(specialCharPrice.discountPercentage).toBe(15);
    expect(specialCharPrice.effectivePrice).toBe(85);
    expect(specialCharPrice.priceAmount).toBe(100);
    expect(specialCharPrice.productId).toBe(123);
    expect(specialCharPrice.vendorId).toBe(456);
  });

  it('should handle empty string for currency', () => {
    const emptyCurrencyPrice: Price = {
      priceId: 1,
      currency: '',
      discountPercentage: 20,
      effectivePrice: 80,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    expect(emptyCurrencyPrice.priceId).toBe(1);
    expect(emptyCurrencyPrice.currency).toBe('');
    expect(emptyCurrencyPrice.discountPercentage).toBe(20);
    expect(emptyCurrencyPrice.effectivePrice).toBe(80);
    expect(emptyCurrencyPrice.priceAmount).toBe(100);
    expect(emptyCurrencyPrice.productId).toBe(123);
    expect(emptyCurrencyPrice.vendorId).toBe(456);
  });
});
