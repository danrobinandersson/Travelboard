import { Component, effect, inject, input, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import type { Country } from '../../models/country';
import { ImagesService } from '../../services/images-service';
import { AboutWidget } from '../about-widget/about-widget';

@Component({
  selector: 'app-wikipedia-widget',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle, AboutWidget],
  templateUrl: './wikipedia-widget.html',
  styleUrl: './wikipedia-widget.scss',
})
export class WikipediaWidget {
  private readonly imagesService = inject(ImagesService);

  readonly country = input.required<Country>();

  protected readonly photoUrl = signal<string | null>(null);

  constructor() {
    // Fetch the photo whenever the country changes
    effect((onCleanup) => {
      const country = this.country();
      this.photoUrl.set(null);
      if (!country.capital) return;

      const subscription = this.imagesService
        .getCountryImage(country.capital, country.name, 960)
        .subscribe({
          next: ({ imageUrl }) => this.photoUrl.set(imageUrl),
          error: () => undefined,
        });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
