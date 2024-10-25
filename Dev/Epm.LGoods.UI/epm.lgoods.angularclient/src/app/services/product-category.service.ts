


/// running

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  public apiUrl = 'http://localhost:5292/api/ProductCategory'; // Update with correct URL

  constructor(private http: HttpClient) { }



  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  addCategoryMapping(mapping: any): Observable<void> {
    console.log(mapping);
    console.log("maping...");
    return this.http.post<void>(`${this.apiUrl}/saveMappings`, mapping);
  }

  removeCategoryMapping(mapping: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, mapping);
  }
}

