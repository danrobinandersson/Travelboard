import { Component, OnInit, computed, inject, output, signal } from '@angular/core';

import { Country } from '../../models/country';
import { CountriesService } from '../../services/countries-service';

@Component({
  selector: 'app-country-picker',
  imports: [],
  templateUrl: './country-picker.html',
  styleUrl: './country-picker.scss',
})

export class CountryPicker implements OnInit {
  private readonly countriesService = inject(CountriesService);

  readonly countrySelected = output<Country>();

  protected readonly countries = signal<Country[]>([]);
  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.countries().filter((c) => c.name.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries.set(countries);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load countries.');
        this.loading.set(false);
      },
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(country: Country): void {
    this.countrySelected.emit(country);
  }
}
