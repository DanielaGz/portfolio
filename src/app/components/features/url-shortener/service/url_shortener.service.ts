// shortener.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShortenerService {
  private baseUrl = 'http://127.0.0.1:8000'; // cambia por tu endpoint real

  constructor(private http: HttpClient) {}

  shortenUrl(url: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/shorten`, { long_url: url });
  }
}
