import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const router = inject(Router);

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      const message = error?.error;

      if (typeof message === 'string' && message.includes('Token has expired')) {
        localStorage.removeItem('auth_token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
