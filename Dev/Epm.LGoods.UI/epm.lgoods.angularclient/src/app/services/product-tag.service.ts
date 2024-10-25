import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';
import { environment } from '../../Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductTagService {

  private apiUrl = environment.apiUrlProductTag; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  getAllTags(): Observable<{ $values: Tag[] }> {
    return this.http.get<{ $values: Tag[] }>(`${this.apiUrl}/tags`);
  }


  addTagsToProduct(productId: number, tagIds: number[]): Observable<void> {
    const dto = { productId, tagIds };
    return this.http.post<void>(`${this.apiUrl}/addTags`, dto);
  }

   getTagsForProduct(productId: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/product/${productId}/tags`);
  }
}
