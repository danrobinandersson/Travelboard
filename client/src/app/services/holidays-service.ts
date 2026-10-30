import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { Holiday } from '../models/holiday';

@Injectable({ providedIn: 'root' })
export class HolidaysService {
  private http = inject(HttpClient);

  getHolidays(country: string, year?: number): Observable<Holiday[]> {
    let params = new HttpParams().set('country', country);
    if (year !== undefined) {
      params = params.set('year', year);
    }
    return this.http.get<Holiday[]>(`${API_URL}/holidays`, { params });
  }
}
