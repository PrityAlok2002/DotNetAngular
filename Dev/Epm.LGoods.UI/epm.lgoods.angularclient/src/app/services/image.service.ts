import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = environment.apiUrlProduct;

  constructor(private http: HttpClient) { }

  saveSelectedImages(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/ProductImage`, formData);
  }


  getImages(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/ProductImage`);
  }
}
