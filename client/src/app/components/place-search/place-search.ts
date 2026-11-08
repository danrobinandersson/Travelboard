import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import type { Place } from '../../models/place';
import { PlacesService } from '../../services/places-service';

@Component({
  selector: 'app-place-search',
  imports: [],
  templateUrl: './place-search.html',
  styleUrl: './place-search.scss',
})
export class PlaceSearch {
  private readonly placesService = inject(PlacesService);

  readonly countryCode = input.required<string>();
  readonly placeSelected = output<Place>();

  protected readonly results = signal<Place[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searched = signal(false);

  constructor() {
    // The router reuses this component when the country changes,
    // so clear the old results (same reason as the effects in the widgets)
    effect(() => {
      this.countryCode();
      this.results.set([]);
      this.error.set(null);
      this.searched.set(false);
    });
  }

  protected search(text: string): void {
    const query = text.trim();
    if (query.length < 2) {
      this.error.set('Type at least 2 letters.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.placesService.search(this.countryCode(), query).subscribe({
      next: (places) => {
        this.results.set(places);
        this.searched.set(true);
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

  protected choose(place: Place): void {
    this.placeSelected.emit(place);
    this.results.set([]);
    this.searched.set(false);
  }
}
