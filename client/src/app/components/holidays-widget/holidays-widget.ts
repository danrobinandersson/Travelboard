import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import type { Holiday } from '../../models/holiday';
import { HolidaysService } from '../../services/holidays-service';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-holidays-widget',
  imports: [DatePipe, AgGridAngular],
  templateUrl: './holidays-widget.html',
  styleUrl: './holidays-widget.scss',
})
export class HolidaysWidget {
  private readonly holidaysService = inject(HolidaysService);

  readonly countryCode = input.required<string>();

  protected readonly holidays = signal<Holiday[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly columnDefs: ColDef<Holiday>[] = [
    { field: 'date', headerName: 'Date', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'localName', headerName: 'Local name', sortable: true, filter: true },
    {
      headerName: 'Type',
      valueGetter: (params) => params.data?.types.join(', ') ?? '',
    },
  ];

  constructor() {
    effect((onCleanup) => {
      const code = this.countryCode();

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.holidaysService.getHolidays(code).subscribe({
        next: (response) => {
          this.holidays.set(response);
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
