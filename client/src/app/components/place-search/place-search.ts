import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import type { Place } from '../../models/place';
import { PlacesService } from '../../services/places-service';

@Component({
  selector: 'app-place-search',
  imports: [MatAutocomplete, MatAutocompleteTrigger, MatOption, MatFormField, MatLabel, MatInput],
  templateUrl: './place-search.html',
  styleUrl: './place-search.scss',
})
export class PlaceSearch {
  private readonly placesService = inject(PlacesService);

  readonly countryCode = input.required<string>();
  // The place the parent currently shows. null clears the text box (e.g. after "Reset location")
  readonly selected = input<Place | null>(null);
  readonly placeSelected = output<Place>();

  protected readonly query = signal('');
  protected readonly results = signal<Place[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searched = signal(false);

  // Every keystroke goes in here, and the pipe below turns it into at most one request
  private readonly typed = new Subject<string>();

  constructor() {
    this.typed
      .pipe(
        debounceTime(400), // wait until the user stops typing
        distinctUntilChanged(),
        switchMap((text) => {
          const query = text.trim();
          if (query.length < 2) {
            this.results.set([]);
            this.searched.set(false);
            this.loading.set(false);
            return of(null);
          }

          this.loading.set(true);
          this.error.set(null);
          return this.placesService.search(this.countryCode(), query).pipe(
            catchError((err: HttpErrorResponse) => {
              this.error.set(
                err.status === 0
                  ? 'Could not reach the server.'
                  : (err.error?.error ?? 'Something went wrong.'),
              );
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((places) => {
        this.results.set(places ?? []);
        this.searched.set(places !== null);
        this.loading.set(false);
      });

    // Show the chosen place in the box, or empty it when nothing is chosen
    effect(() => {
      this.query.set(this.selected()?.name ?? '');
    });

    // The router reuses this component when the country changes, so drop the old results
    effect(() => {
      this.countryCode();
      this.results.set([]);
      this.error.set(null);
      this.searched.set(false);
    });
  }

  protected onType(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.query.set(text);
    this.typed.next(text);
  }

  protected label(place: Place): string {
    return place.region ? `${place.name}, ${place.region}` : place.name;
  }

  protected displayPlace(place: Place | null): string {
    return place?.name ?? '';
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.placeSelected.emit(event.option.value as Place);
  }
}
