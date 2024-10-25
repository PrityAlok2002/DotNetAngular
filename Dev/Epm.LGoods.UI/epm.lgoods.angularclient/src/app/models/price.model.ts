export interface Price {
  priceId: number;
  currency: string;
  discountPercentage: number;
  effectivePrice: number;
  priceAmount: number;
  productId: number;
  vendorId: number;
}
