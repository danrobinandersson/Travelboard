import { Injectable, signal } from '@angular/core';

// The base currency the user has chosen, e.g. 'SEK'. The exchange rate widget changes it,
// and the compare view uses the same one, so the two always agree.
@Injectable({ providedIn: 'root' })
export class BaseCurrencyService {
  readonly base = signal('SEK');
}
