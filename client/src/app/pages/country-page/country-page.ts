import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ExchangeRateWidget } from '../../components/exchange-rate-widget/exchange-rate-widget';
import { Country } from '../../models/country';
import { CountriesService } from '../../services/countries-service';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';

@Component({
  selector: 'app-country-page',
  imports: [RouterLink, ExchangeRateWidget, WeatherWidget],
  templateUrl: './country-page.html',
  styleUrl: './country-page.scss',
})
export class CountryPage {
  private readonly countriesService = inject(CountriesService);

  // Filled in by the router from the ":code" part of /country/:code
  readonly code = input.required<string>();

  protected readonly country = signal<Country | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // Only the first currency is used for now
  protected readonly currency = computed(() => this.country()?.currencies[0]?.code ?? null);

  protected readonly weatherHeading = computed(() => {
    const c = this.country();
    if (!c) return 'Weather';
    return c.coordinatesSource === 'capital' && c.capital
      ? `Weather in ${c.capital}`
      : `Weather near the centre of ${c.name}`;
  });

  constructor() {
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
