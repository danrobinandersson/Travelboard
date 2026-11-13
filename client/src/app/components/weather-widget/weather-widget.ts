import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import type { Country } from '../../models/country';
import type { Place } from '../../models/place';
import type { WeatherResponse } from '../../models/weather';
import { WeatherService } from '../../services/weather-service';
import { describeSymbol } from '../../utils/weather-symbol';
import { PlaceSearch } from '../place-search/place-search';

@Component({
  selector: 'app-weather-widget',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatIcon,
    DatePipe,
    DecimalPipe,
    PlaceSearch,
  ],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
})
export class WeatherWidget {
  private readonly weatherService = inject(WeatherService);

  readonly country = input.required<Country>();

  // A city picked by the user. It goes back to null by itself whenever the country changes
  // Tells the page which city is picked (null = none), so the map can follow
  readonly placeChange = output<Place | null>();

  protected readonly selectedPlace = linkedSignal<Country, Place | null>({
    source: this.country,
    computation: () => null,
  });

  // The point the weather is fetched for: the picked city, otherwise the country's default point
  protected readonly point = computed(() => {
    const place = this.selectedPlace();
    if (place) return { lat: place.latitude, lng: place.longitude };
    return this.country().coordinates;
  });

  protected readonly heading = computed(() => {
    const place = this.selectedPlace();
    if (place) return `Weather in ${place.name}`;

    const c = this.country();
    return c.coordinatesSource === 'capital' && c.capital
      ? `Weather in ${c.capital}`
      : `Weather near the centre of ${c.name}`;
  });

  protected readonly data = signal<WeatherResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // Text and emoji for the current weather
  protected readonly currentInfo = computed(() =>
    describeSymbol(this.data()?.current.symbol ?? null),
  );

  // Each day plus its text and emoji
  protected readonly days = computed(() =>
    (this.data()?.daily ?? []).map((day) => ({
      ...day,
      ...describeSymbol(day.symbol),
    })),
  );

  constructor() {
    effect(() => this.placeChange.emit(this.selectedPlace()));

    effect((onCleanup) => {
      const point = this.point();

      if (!point) {
        this.data.set(null);
        this.loading.set(false);
        this.error.set("Weather isn't available for this country.");
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.weatherService.getWeather(point.lat, point.lng).subscribe({
        next: (response) => {
          this.data.set(response);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          // status 0 means the request never reached the server (server down, network)
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
