export interface ProductFilter {
  productName: string;
  productType: string;
  countryOfOrigin: string;
  [key: string]: string | number;
}
