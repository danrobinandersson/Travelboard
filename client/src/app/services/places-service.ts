import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { Place } from '../models/place';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private http = inject(HttpClient);

  search(country: string, query: string): Observable<Place[]> {
    const params = new HttpParams().set('country', country).set('query', query);
    return this.http.get<Place[]>(`${API_URL}/places`, { params });
  }
}
