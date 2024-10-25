import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Price } from '../models/price.model';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private apiUrl = 'http://localhost:5292/api/prices'; // Update with your API URL

  constructor(private http: HttpClient) { }

  

  getPriceById(id: number): Observable<Price> {
    return this.http.get<Price>(`${this.apiUrl}/${id}`).pipe(
      
    );
  }

  // Create a new price
  createPrice(price: Price): Observable<Price> {
    return this.http.post<Price>(this.apiUrl, price).pipe(
     
    );
  }

  // Update an existing price
  updatePrice(price: Price): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${price.priceId}`, price).pipe(
      
    );
  }

 
  
}
