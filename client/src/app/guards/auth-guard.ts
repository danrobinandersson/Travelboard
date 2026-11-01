import { toObservable } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth-service';

// Waits until Supabase has restored the session (user is no longer undefined),
// then lets logged-in users through and sends everyone else to /login.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.user).pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login']))),
  );
};
