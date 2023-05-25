import { Resolve, ResolveFn } from '@angular/router';
import { AuthService } from '@src/app/services/api/auth.service';
import { first, firstValueFrom, Observable, take } from 'rxjs';
import { inject } from '@angular/core';

export const authResolver: ResolveFn<Observable<Object | null>> = () => {
  const authService = inject(AuthService);
  return authService.checkAuth().pipe(take(1));
};
