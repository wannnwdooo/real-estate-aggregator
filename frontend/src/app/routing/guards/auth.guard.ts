import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@src/app/services/api/auth.service';
import { catchError, first, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    first(),
    map(() => true),
    catchError(() => of(router.createUrlTree(['/auth'])))
  );
};
