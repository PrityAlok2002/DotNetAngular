import { Category } from "./category";
import { Product } from "./product";


//export interface ProductCategory {
//  categoryId: number;
//  isFeatured: boolean;
//  displayOrder: number;
//  productId?: number;     // Optional field, if needed
//  product?: any;          // Replace `any` with the actual type if you have a Product model
//  category?: any;         // Replace `any` with the actual type if you have a Category model
//}


export interface ProductCategory {
  productCategoryId: number; 
  productId: number;         
  product?: Product;         
  categoryId: number;        
  category?: Category;       
  isFeatured?: boolean;      
  displayOrder?: number;     
}
