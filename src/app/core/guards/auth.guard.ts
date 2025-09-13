import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.getToken() || tokenService.isTokenExpired()) {
    tokenService.removeToken();
    router.navigate(['/user']);
    return false;
  }

  return true;
};
