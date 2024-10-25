import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';
import { Product } from '../models/product';
import { ProductFilter } from '../models/product-filter';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5292/api/products';
  constructor(private http: HttpClient) { }

  createProduct(product: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  fetchAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  fetchProducts(filters: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //low-stock method
  getLowStockProducts(): Observable<{ $values: Product[] }> {
    return this.http.get<{ $values: Product[] }>(`${this.apiUrl}/low-stock`);
  }

  fetchProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }
}
