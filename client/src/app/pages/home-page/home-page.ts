import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CountryPicker } from '../../components/country-picker/country-picker';
import { Country } from '../../models/country';

@Component({
  selector: 'app-home-page',
  imports: [CountryPicker],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly router = inject(Router);

  protected openCountry(country: Country): void {
    this.router.navigate(['/country', country.code]);
  }
}
