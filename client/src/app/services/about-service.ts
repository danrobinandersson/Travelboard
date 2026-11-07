import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { About } from '../models/about';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private http = inject(HttpClient);

  getAbout(name: string): Observable<About> {
    const params = new HttpParams().set('name', name);
    return this.http.get<About>(`${API_URL}/about`, { params });
  }
}
