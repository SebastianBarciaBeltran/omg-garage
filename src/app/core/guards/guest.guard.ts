import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { of } from 'rxjs';
import { AuthService } from '@auth/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _authService = inject(AuthService);

  const isLoggedIn = _authService.isAuthenticated();

  return of(isLoggedIn ? router.createUrlTree(['/home']) : true);
};
