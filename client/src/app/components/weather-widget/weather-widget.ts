import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import type { WeatherResponse } from '../../models/weather';
import { WeatherService } from '../../services/weather-service';
import { describeSymbol } from '../../utils/weather-symbol';

@Component({
  selector: 'app-weather-widget',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
})
export class WeatherWidget {
  private readonly weatherService = inject(WeatherService);

  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly heading = input('Weather');

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
    effect((onCleanup) => {
      const latitude = this.latitude();
      const longitude = this.longitude();

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.weatherService.getWeather(latitude, longitude).subscribe({
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
