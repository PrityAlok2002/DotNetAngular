import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Tag } from '../models/tag.model';


@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'http://localhost:5292/api/tags'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }


  getTags(tagName?: string, published?: boolean): Observable<Tag[]> {
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
    if (published !== undefined) {
      params = params.set('published', String(published));
    }
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.$values || []),
      tap(tags => {
        console.log('Received tags:', tags);
      })
    );
  }

  addTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, tag);
  }

  updateTag(tag: Tag): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${tag.tagId}`, tag);
  }

  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tagId}`);
  }
}
