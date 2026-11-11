import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Country } from '../../models/country';
import { CompareService } from '../../services/compare-service';
import { CountriesService } from '../../services/countries-service';
import { FavouritesService } from '../../services/favourites-service';

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

  private readonly allCountries = signal<Country[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // Only the countries whose code is in the favourites list
  protected readonly favouriteCountries = computed(() =>
    this.allCountries().filter((country) => this.favourites.codes().includes(country.code)),
  );

  // Stop the click from also opening the country
  protected toggleCompare(event: Event, code: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.compare.toggle(code);
  }

  constructor() {
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
