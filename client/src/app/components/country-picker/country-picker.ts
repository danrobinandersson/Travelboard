import { Component, OnInit, computed, inject, output, signal } from '@angular/core';
import { Country } from '../../models/country';
import { CountriesService } from '../../services/countries-service';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-country-picker',
  imports: [MatAutocomplete, MatAutocompleteTrigger, MatOption, MatFormField, MatLabel, MatInput],
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

  protected displayCountry(country: Country | null): string {
    return country?.name ?? '';
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const country = event.option.value as Country;
    this.query.set(country.name);
    this.countrySelected.emit(country);
  }
}
