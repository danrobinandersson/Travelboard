import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ExchangeRateWidget } from '../../components/exchange-rate-widget/exchange-rate-widget';
import { Country } from '../../models/country';
import { CountriesService } from '../../services/countries-service';
import { AuthService } from '../../services/auth-service';
import { FavouritesService } from '../../services/favourites-service';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { FactsWidget } from '../../components/facts-widget/facts-widget';
import { HolidaysWidget } from '../../components/holidays-widget/holidays-widget';
import { PlaceSearch } from '../../components/place-search/place-search';
import type { Place } from '../../models/place';

@Component({
  selector: 'app-country-page',
  imports: [
    MatButton,
    MatIcon,
    ExchangeRateWidget,
    WeatherWidget,
    FactsWidget,
    HolidaysWidget,
    PlaceSearch,
  ],
  templateUrl: './country-page.html',
  styleUrl: './country-page.scss',
})
export class CountryPage {
  private readonly countriesService = inject(CountriesService);
  protected readonly auth = inject(AuthService);
  protected readonly favourites = inject(FavouritesService);

  // Filled in by the router from the ":code" part of /country/:code
  readonly code = input.required<string>();

  protected readonly country = signal<Country | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // Only the first currency is used for now
  protected readonly currency = computed(() => this.country()?.currencies[0]?.code ?? null);

  // A place picked by the user. null means "use the country's default point"
  protected readonly selectedPlace = signal<Place | null>(null);

  // The point the weather widget shows
  protected readonly weatherPoint = computed(() => {
    const place = this.selectedPlace();
    if (place) return { lat: place.latitude, lng: place.longitude };
    return this.country()?.coordinates ?? null;
  });

  protected readonly weatherHeading = computed(() => {
    const place = this.selectedPlace();
    if (place) return `Weather in ${place.name}`;

    const c = this.country();
    if (!c) return 'Weather';
    return c.coordinatesSource === 'capital' && c.capital
      ? `Weather in ${c.capital}`
      : `Weather near the centre of ${c.name}`;
  });

  protected toggleFavourite(code: string): void {
    if (this.favourites.isFavourite(code)) {
      void this.favourites.remove(code);
    } else {
      void this.favourites.add(code);
    }
  }

  constructor() {
    // Runs again when the code changes, e.g. /country/SE -> /country/NO
    // (the router reuses this component instead of creating a new one)
    effect((onCleanup) => {
      const code = this.code();

      this.selectedPlace.set(null);
      this.loading.set(true);
      this.error.set(null);

      const subscription = this.countriesService.getCountry(code).subscribe({
        next: (country) => {
          this.country.set(country);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.country.set(null);
          this.error.set(
            err.status === 0
              ? 'Could not reach the server.'
              : (err.error?.error ?? 'Something went wrong.'),
          );
          this.loading.set(false);
        },
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
