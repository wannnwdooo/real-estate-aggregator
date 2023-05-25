import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@src/app/services/api/auth.service';
import { catchError, first, map, of } from 'rxjs';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    first(),
    map(() => router.createUrlTree(['/admin'])),
    catchError(() => of(true))
  );
};
