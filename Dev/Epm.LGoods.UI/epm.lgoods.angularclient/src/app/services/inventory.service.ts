import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../Environments/environments';
import { Inventory } from '../models/Inventory';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = environment.apiUrlInventory // Adjust URL as needed

  constructor(private http: HttpClient) { }

  // POST method to create a new inventory item
  createInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.apiUrl}/update`, inventory);
  }

}
