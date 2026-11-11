import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { catchError, forkJoin, of } from 'rxjs';
import { Country } from '../../models/country';
import { RatesResponse } from '../../models/rates';
import { WeatherResponse } from '../../models/weather';
import { CompareService } from '../../services/compare-service';
import { CountriesService } from '../../services/countries-service';
import { RatesService } from '../../services/rates-service';
import { WeatherService } from '../../services/weather-service';
import { describeSymbol } from '../../utils/weather-symbol';

// The weather numbers shown for one country
interface WeatherStats {
  temperature: number | null;
  text: string;
  icon: string;
  avgHigh: number | null; // average of the daily highs, °C
  sunnyDays: number; // days with clear or fair weather
  rain: number; // total precipitation, mm
}

const HOME_CURRENCY = 'SEK';

// What one cell of the exchange rate row shows
type RateCell =
  | { kind: 'home' } // the country uses SEK, so there is nothing to convert
  | { kind: 'rate'; code: string; rate: number; change: number }; // change = % over the period

const round1 = (value: number): number => Math.round(value * 10) / 10;

function toStats(weather: WeatherResponse): WeatherStats {
  const highs = weather.daily.map((d) => d.tempMax).filter((t): t is number => t !== null);
  const rain = weather.daily.reduce((sum, d) => sum + (d.precipitation ?? 0), 0);

  return {
    temperature: weather.current.temperature,
    ...describeSymbol(weather.current.symbol),
    avgHigh: highs.length > 0 ? round1(highs.reduce((a, b) => a + b, 0) / highs.length) : null,
    sunnyDays: weather.daily.filter(
      (d) => d.symbol?.startsWith('clearsky') || d.symbol?.startsWith('fair'),
    ).length,
    rain: round1(rain),
  };
}

// Positions of the best values. With fewer than two values there is nothing to compare.
function bestPositions(values: (number | null)[], better: 'high' | 'low'): number[] {
  const present = values.filter((v): v is number => v !== null);
  if (present.length < 2) return [];
  const target = better === 'high' ? Math.max(...present) : Math.min(...present);
  return values.flatMap((v, i) => (v === target ? [i] : []));
}

@Component({
  selector: 'app-compare-dialog',
  imports: [MatDialogTitle, MatDialogContent, DecimalPipe],
  templateUrl: './compare-dialog.html',
  styleUrl: './compare-dialog.scss',
})
export class CompareDialog {
  private readonly compare = inject(CompareService);
  private readonly dialogRef = inject(MatDialogRef<CompareDialog>);
  private readonly countriesService = inject(CountriesService);
  private readonly weatherService = inject(WeatherService);
  private readonly ratesService = inject(RatesService);

  private readonly allCountries = signal<Country[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // The picked countries, in the order they were picked
  protected readonly countries = computed(() =>
    this.compare
      .codes()
      .map((code) => this.allCountries().find((country) => country.code === code))
      .filter((country): country is Country => country !== undefined),
  );

  // Stored by country code, so removing a country does not shift the other results.
  // null means the weather could not be fetched.
  private readonly weather = signal<Record<string, WeatherResponse | null>>({});
  protected readonly weatherLoading = signal(true);

  // One entry per column, in the same order as countries()
  protected readonly stats = computed(() =>
    this.countries().map((country) => {
      const weather = this.weather()[country.code];
      return weather ? toStats(weather) : null;
    }),
  );

  // null means no rate is available
  private readonly rates = signal<Record<string, RatesResponse | 'home' | null>>({});
  protected readonly ratesLoading = signal(true);

  protected readonly rateCells = computed<(RateCell | null)[]>(() =>
    this.countries().map((country) => {
      const r = this.rates()[country.code];
      if (r === 'home') return { kind: 'home' };
      if (!r || r.history.length === 0) return null;
      // Positive: 1 SEK buys more than it did at the start of the period, so SEK got stronger
      const first = r.history[0]?.rate ?? r.latest.rate;
      return {
        kind: 'rate',
        code: r.target,
        rate: r.latest.rate,
        change: round1(((r.latest.rate - first) / first) * 100),
      };
    }),
  );

  // Which columns win each weather row (ties give several winners)
  protected readonly best = computed(() => {
    const stats = this.stats();
    return {
      warmest: bestPositions(
        stats.map((s) => s?.avgHigh ?? null),
        'high',
      ),
      sunniest: bestPositions(
        stats.map((s) => s?.sunnyDays ?? null),
        'high',
      ),
      driest: bestPositions(
        stats.map((s) => s?.rain ?? null),
        'low',
      ),
      // The best rate is the one where SEK gained the most
      rate: bestPositions(
        this.rateCells().map((cell) => (cell?.kind === 'rate' ? cell.change : null)),
        'high',
      ),
    };
  });

  constructor() {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.allCountries.set(countries);
        this.loading.set(false);
        this.loadWeather();
        this.loadRates();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 0
            ? 'Could not reach the server.'
            : (err.error?.error ?? 'Something went wrong.'),
        );
        this.loading.set(false);
      },
    });
  }

  // One weather request per country. A failed one becomes null and does not affect the others.
  private loadWeather(): void {
    const countries = this.countries();
    // forkJoin never emits for an empty list, so skip the request step
    if (countries.length === 0) {
      this.weatherLoading.set(false);
      return;
    }
    const requests = countries.map((country) =>
      country.coordinates
        ? this.weatherService
            .getWeather(country.coordinates.lat, country.coordinates.lng)
            .pipe(catchError(() => of(null)))
        : of(null),
    );

    forkJoin(requests).subscribe((results) => {
      this.weather.set(Object.fromEntries(countries.map((c, i) => [c.code, results[i] ?? null])));
      this.weatherLoading.set(false);
    });
  }

  // The rate of the country's first currency against SEK, like the exchange rate widget
  private loadRates(): void {
    const countries = this.countries();
    if (countries.length === 0) {
      this.ratesLoading.set(false);
      return;
    }
    const requests = countries.map((country) => {
      const code = country.currencies[0]?.code;
      if (!code) return of(null);
      if (code === HOME_CURRENCY) return of('home' as const);
      return this.ratesService.getRates(HOME_CURRENCY, code).pipe(catchError(() => of(null)));
    });

    forkJoin(requests).subscribe((results) => {
      this.rates.set(Object.fromEntries(countries.map((c, i) => [c.code, results[i] ?? null])));
      this.ratesLoading.set(false);
    });
  }

  protected remove(code: string): void {
    this.compare.toggle(code);
    // Nothing left to compare
    if (this.compare.codes().length === 0) this.dialogRef.close();
  }

  // true -> "Yes", false -> "No", null -> "Unknown"
  protected yesNo(value: boolean | null): string {
    if (value === null) return 'Unknown';
    return value ? 'Yes' : 'No';
  }
}
