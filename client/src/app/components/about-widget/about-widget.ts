import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import type { About } from '../../models/about';
import { AboutService } from '../../services/about-service';

@Component({
  selector: 'app-about-widget',
  imports: [],
  templateUrl: './about-widget.html',
  styleUrl: './about-widget.scss',
})
export class AboutWidget {
  private readonly aboutService = inject(AboutService);

  readonly countryName = input.required<string>();

  protected readonly data = signal<About | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const name = this.countryName();

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.aboutService.getAbout(name).subscribe({
        next: (response) => {
          this.data.set(response);
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

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
