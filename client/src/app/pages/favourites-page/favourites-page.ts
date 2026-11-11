import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Country } from '../../models/country';
import { CompareService } from '../../services/compare-service';
import { CountriesService } from '../../services/countries-service';
import { FavouritesService } from '../../services/favourites-service';
import { ImagesService } from '../../services/images-service';

@Component({
  selector: 'app-favourites-page',
  imports: [RouterLink, MatIconButton, MatIcon, MatTooltip],
  templateUrl: './favourites-page.html',
  styleUrl: './favourites-page.scss',
})
export class FavouritesPage {
  private readonly countriesService = inject(CountriesService);
  protected readonly favourites = inject(FavouritesService);
  protected readonly compare = inject(CompareService);
  private readonly imagesService = inject(ImagesService);

  private readonly allCountries = signal<Country[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // Only the countries whose code is in the favourites list
  protected readonly favouriteCountries = computed(() =>
    this.allCountries().filter((country) => this.favourites.codes().includes(country.code)),
  );

  // Photo URLs by country code. A country without an entry has no photo (yet).
  private readonly images = signal<Record<string, string>>({});
  // Codes we have already asked for, so each photo is only requested once
  private readonly requested = new Set<string>();

  protected backgroundFor(code: string): string | null {
    const url = this.images()[code];
    return url ? `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7)), url("${url}")` : null;
  }

  private loadImage(country: Country): void {
    if (!country.capital || this.requested.has(country.code)) return;
    this.requested.add(country.code);

    this.imagesService.getCountryImage(country.capital, country.name).subscribe({
      next: ({ imageUrl }) => {
        if (imageUrl) this.images.update((all) => ({ ...all, [country.code]: imageUrl }));
      },
      error: () => undefined,
    });
  }

  // Stop the click from also opening the country
  protected toggleCompare(event: Event, code: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.compare.toggle(code);
  }

  constructor() {
    // Ask for a photo for every favourite, also ones added later
    effect(() => {
      for (const country of this.favouriteCountries()) this.loadImage(country);
    });

    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.allCountries.set(countries);
        this.loading.set(false);
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
}
