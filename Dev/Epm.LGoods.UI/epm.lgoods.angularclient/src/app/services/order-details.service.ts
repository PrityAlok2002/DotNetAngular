import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailsDto } from '../models/order-detail';
import { environment } from '../../Environments/environments';


@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  private baseUrl = environment.apiUrlOrderDetails;

  constructor(private http: HttpClient) { }

  getOrderDetails(id: number): Observable<OrderDetailsDto> {
    return this.http.get<OrderDetailsDto>(`${this.baseUrl}/${id}`);
  }
}
