import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {
  private apiUrl = 'http://localhost:5292/api/products/Category';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createCategory(category: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  updateCategory(categoryId: number, category: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${categoryId}`, category);
  }

  getCategoryById(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}`);
  }

  validateCategoryName(categoryName: string): Observable<boolean> {
    const encodedName = encodeURIComponent(categoryName);
    return this.http.get<boolean>(`${this.apiUrl}/validate?name=${encodedName}`);
  }
}
