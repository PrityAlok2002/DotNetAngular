import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegistrationDto } from '../models/RegistrationDto';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5002/api/Registration';

  constructor(private http: HttpClient) { }

  register(registrationDto: RegistrationDto): Observable<any> {
    return this.http.post(this.apiUrl, registrationDto).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message || 'An error occurred during registration.'));
      })
    );
  };
  

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CheckEmailExists`, { params: { email } });
  }
}
