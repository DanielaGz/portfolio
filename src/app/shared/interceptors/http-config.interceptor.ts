import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private readonly TIMEOUT_MS = 30000; // 30 seconds
  private readonly MAX_RETRIES = 2;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(this.TIMEOUT_MS),
      retry({
        count: this.MAX_RETRIES,
        delay: (error: HttpErrorResponse, retryCount) => {
          // Only retry on network errors or 5xx server errors
          if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
            const delayMs = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
            console.log(`Retry attempt ${retryCount + 1} after ${delayMs}ms`);
            return timer(delayMs);
          }
          // Don't retry on client errors (4xx)
          throw error;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out. Please try again.'));
        }
        return throwError(() => error);
      })
    );
  }
}
