import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { CountryImage } from '../models/country-image';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private http = inject(HttpClient);

  // A photo of the capital, taken from Wikipedia. The server allows widths 500 (default) and 960.
  getCountryImage(capital: string, country: string, width?: number): Observable<CountryImage> {
    let params = new HttpParams().set('capital', capital).set('country', country);
    if (width !== undefined) params = params.set('width', width);
    return this.http.get<CountryImage>(`${API_URL}/images`, { params });
  }
}
