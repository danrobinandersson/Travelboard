import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-country-page',
  imports: [RouterLink],
  templateUrl: './country-page.html',
})
export class CountryPage {
  // Filled in by the router from the ":code" part of /country/:code
  readonly code = input.required<string>();
}
