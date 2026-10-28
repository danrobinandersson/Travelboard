import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { WeatherResponse } from '../models/weather';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);

  getWeather(latitude: number, longitude: number): Observable<WeatherResponse> {
    const params = new HttpParams().set('latitude', latitude).set('longitude', longitude);
    return this.http.get<WeatherResponse>(`${API_URL}/weather`, { params });
  }
}
