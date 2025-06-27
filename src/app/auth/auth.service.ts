import { Injectable } from '@angular/core';
import { users } from '@core/db/users';
import { User } from '@core/models';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // apiUrl = environment.apiUrl;

  users: User[] = users;

  // constructor(private readonly http: HttpClient) {}

  /**
   * Simula login con verificación y entrega de "token"
   */
  login({ username, password }: User): Observable<{ user: User; token: string }> {
    const user = this.users.find(user => user.username === username && user.password === password);

    if (!user)
      return throwError(() => ({
        message: 'El nombre de usuario o la contraseña son incorrectos.',
      }));

    const fakeToken = btoa(`${username}:${password}`);

    this.setSession(user, fakeToken);
    return of({ user, token: fakeToken });
  }

  register(newUser: User): Observable<User> {
    const exists = this.users.some(user => user.username === newUser.username);

    if (exists) return throwError(() => new Error('El usuario ya existe'));

    this.users.push(newUser);

    return of(newUser);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('USER_KEY');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('USER_KEY');
    localStorage.removeItem('token');
  }

  private setSession(user: User, token: string): void {
    localStorage.setItem('USER_KEY', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}
