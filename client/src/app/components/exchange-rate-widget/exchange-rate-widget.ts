import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { RatesResponse } from '../../models/rates';
import { RatesService } from '../../services/rates-service';

@Component({
  selector: 'app-exchange-rate-widget',
  imports: [DecimalPipe],
  templateUrl: './exchange-rate-widget.html',
  styleUrl: './exchange-rate-widget.scss',
})
export class ExchangeRateWidget implements OnInit {
  private readonly ratesService = inject(RatesService);

  readonly base = input('SEK');
  readonly target = input('EUR');

  protected readonly data = signal<RatesResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // The last 7 days, newest first
  protected readonly recent = computed(() => this.data()?.history.slice(-7).reverse() ?? []);

  ngOnInit(): void {
    this.ratesService.getRates(this.base(), this.target()).subscribe({
      next: (response) => {
        this.data.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        // status 0 means the request never reached the server (server down, network)
        this.error.set(
          err.status === 0
            ? 'Could not reach the server.'
            : (err.error?.error ?? 'Something went wrong.'),
        );
        this.loading.set(false);
      },
    });
  }
}
