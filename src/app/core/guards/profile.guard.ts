import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const profileGuard = () => {
  const router = inject(Router);
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');

  if (!profile.name) {
    return router.createUrlTree(['/profile']);
  }
  return true;
};
