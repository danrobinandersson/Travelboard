import { Component, input, signal } from '@angular/core';
import { Country } from '../../models/country';
import { DecimalPipe } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AboutWidget } from '../about-widget/about-widget';

@Component({
  selector: 'app-facts-widget',
  imports: [DecimalPipe, MatSlideToggle, AboutWidget],
  templateUrl: './facts-widget.html',
  styleUrl: './facts-widget.scss',
})
export class FactsWidget {
  country = input.required<Country>();

  protected readonly showAbout = signal(false);

  // true -> "Yes", false -> "No", null -> "Unknown"
  protected yesNo(value: boolean | null): string {
    if (value === null) return 'Unknown';
    return value ? 'Yes' : 'No';
  }
}
