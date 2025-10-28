// shortener.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShortenerService {
  private baseUrl = 'https://url-shortener-111500532067.us-central1.run.app';

  constructor(private http: HttpClient) {}

  shortenUrl(url: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/shorten`, { long_url: url });
  }
}
