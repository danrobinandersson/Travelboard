import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { CountryImage } from '../models/country-image';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private http = inject(HttpClient);

  // A photo of the capital, taken from Wikipedia
  getCountryImage(capital: string, country: string): Observable<CountryImage> {
    const params = new HttpParams().set('capital', capital).set('country', country);
    return this.http.get<CountryImage>(`${API_URL}/images`, { params });
  }
}
