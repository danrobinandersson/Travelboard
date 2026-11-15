import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Component, input } from '@angular/core';
import { Country } from '../../models/country';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-facts-widget',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle, DecimalPipe],
  templateUrl: './facts-widget.html',
  styleUrl: './facts-widget.scss',
})
export class FactsWidget {
  country = input.required<Country>();

  // true -> "Yes", false -> "No", null -> "Unknown"
  protected yesNo(value: boolean | null): string {
    if (value === null) return 'Unknown';
    return value ? 'Yes' : 'No';
  }
}
