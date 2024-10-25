export interface Products {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    productType: string;
    categories: string;
    manufacturer: string;
    countryOfOrigin: string;
}

export interface Filters {
    productType: string;
    categories: string;
    manufacturer: string;
    countryOfOrigin: string;
    price: string;
}

export interface Categories {
    categoryId: string;
    categoryName: string;
    description: string;
    image: string;
    isActive: boolean;
}

export interface CategoryTableProps {
    categories: Categories[];
  }
export type PriceFormData = {
    priceAmount: number;
    currency: 'INR' | 'USD';
    discountPercentage: number;
    effectivePrice: number;
    productId: number;
    vendorId: number;
};
