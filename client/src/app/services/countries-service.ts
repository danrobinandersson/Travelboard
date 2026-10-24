import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../config';
import { Country } from '../models/country';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private readonly http = inject(HttpClient);

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${API_URL}/countries`);
  }

  getCountry(code: string): Observable<Country> {
    return this.http.get<Country>(`${API_URL}/countries/${code}`);
  }
}