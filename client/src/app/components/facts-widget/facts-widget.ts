import { Component, input } from '@angular/core';
import { Country } from '../../models/country';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-facts-widget',
  imports: [DecimalPipe],
  templateUrl: './facts-widget.html',
  styleUrl: './facts-widget.scss',
})
export class FactsWidget {
  country = input.required<Country>();
}
