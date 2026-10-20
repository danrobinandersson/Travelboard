import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../config';
import { RatesResponse } from '../models/rates';

@Injectable({ providedIn: 'root' })
export class RatesService {
  private readonly http = inject(HttpClient);

  getRates(base: string, target: string): Observable<RatesResponse> {
    const params = new HttpParams().set('base', base).set('target', target);
    return this.http.get<RatesResponse>(`${API_URL}/rates`, { params });
  }
}