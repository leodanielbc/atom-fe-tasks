import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.task_api}`;

  constructor(private http: HttpClient) {}

  login(email: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, { email });
  }

  createUser(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { email });
  }
}