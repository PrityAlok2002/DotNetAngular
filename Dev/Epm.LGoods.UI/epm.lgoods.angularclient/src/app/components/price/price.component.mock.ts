import { Price } from '../../models/price.model';

export const mockPrice: Price = {
  priceId: 1,
  productId: 123,
  priceAmount: 100,
  currency: 'USD',
  vendorId: 456,
  discountPercentage: 10,
  effectivePrice: 90
};
