import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`/auth/signin`, { email, password })
      .pipe(tap(() => this.isAuthenticatedSubject.next(true)));
  }

  register(email: string, password: string): Observable<any> {
    return this.http
      .post(`/auth/signup`, { email, password })
      .pipe(tap(() => this.isAuthenticatedSubject.next(true)));
  }

  logout(): Observable<any> {
    return this.http
      .post(`/auth/logout`, {}, { responseType: 'text' })
      .pipe(tap(() => this.isAuthenticatedSubject.next(false)));
  }

  checkAuth() {
    return this.refreshToken().pipe(
      tap(() => this.isAuthenticatedSubject.next(true)),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        return throwError(new Error('User is not authenticated'));
      })
    );
  }

  refreshToken() {
    return this.http.post(`/auth/refresh`, {});
  }
}
