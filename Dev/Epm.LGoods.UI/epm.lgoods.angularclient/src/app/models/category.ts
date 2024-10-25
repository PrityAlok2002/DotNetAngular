import { ProductCategory } from './product-category';

export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  image: string;
  isActive: boolean;
}
