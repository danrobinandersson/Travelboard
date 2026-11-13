import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ExchangeRateWidget } from '../../components/exchange-rate-widget/exchange-rate-widget';
import { Country } from '../../models/country';
import type { Place } from '../../models/place';
import { CountriesService } from '../../services/countries-service';
import { AuthService } from '../../services/auth-service';
import { CompareService } from '../../services/compare-service';
import { FavouritesService } from '../../services/favourites-service';
import { ImagesService } from '../../services/images-service';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { FactsWidget } from '../../components/facts-widget/facts-widget';
import { HolidaysWidget } from '../../components/holidays-widget/holidays-widget';
import { MapWidget } from '../../components/map-widget/map-widget';

@Component({
  selector: 'app-country-page',
  imports: [
    MatButton,
    MatIcon,
    MatTooltip,
    ExchangeRateWidget,
    WeatherWidget,
    FactsWidget,
    HolidaysWidget,
    MapWidget,
  ],
  templateUrl: './country-page.html',
  styleUrl: './country-page.scss',
})
export class CountryPage {
  private readonly countriesService = inject(CountriesService);
  protected readonly auth = inject(AuthService);
  protected readonly favourites = inject(FavouritesService);
  protected readonly compare = inject(CompareService);
  private readonly imagesService = inject(ImagesService);

  // Filled in by the router from the ":code" part of /country/:code
  readonly code = input.required<string>();

  protected readonly country = signal<Country | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // The city picked in the weather widget. The map follows it.
  protected readonly selectedPlace = signal<Place | null>(null);

  // A photo of the capital for the header. null = no photo (yet), the header has none.
  protected readonly photoUrl = signal<string | null>(null);

  // Only the first currency is used for now
  protected readonly currency = computed(() => this.country()?.currencies[0]?.code ?? null);

  // "Copenhagen · Europe", skipping whatever is missing
  protected readonly subtitle = computed(() => {
    const c = this.country();
    return [c?.capital, c?.region].filter(Boolean).join(' · ');
  });

  protected toggleFavourite(code: string): void {
    if (this.favourites.isFavourite(code)) {
      void this.favourites.remove(code);
    } else {
      void this.favourites.add(code);
    }
  }

  constructor() {
    // A new country starts without a picked city
    effect(() => {
      this.country();
      this.selectedPlace.set(null);
    });

    // Fetch the photo whenever a new country has loaded
    effect((onCleanup) => {
      const country = this.country();
      this.photoUrl.set(null);
      if (!country?.capital) return;

      const subscription = this.imagesService
        .getCountryImage(country.capital, country.name)
        .subscribe({
          next: ({ imageUrl }) => this.photoUrl.set(imageUrl),
          // No photo is not a problem: the header just has none
          error: () => undefined,
        });

      onCleanup(() => subscription.unsubscribe());
    });

    // Runs again when the code changes, e.g. /country/SE -> /country/NO
    // (the router reuses this component instead of creating a new one)
    effect((onCleanup) => {
      const code = this.code();

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
