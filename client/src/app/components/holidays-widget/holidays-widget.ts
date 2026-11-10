import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import type { Holiday } from '../../models/holiday';
import { HolidaysService } from '../../services/holidays-service';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'app-holidays-widget',
  imports: [DatePipe, MatCard, MatCardContent, MatCardHeader, MatCardTitle, AgGridAngular, NgxEchartsDirective, MatSlideToggle],
  providers: [provideEchartsCore({ echarts })],
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

  protected readonly showTable = signal(false);

  // Number of holidays and the next one from today (dates look like "2026-01-01", so they sort as text)
  protected readonly summary = computed(() => {
    const list = this.holidays();
    const today = new Date().toISOString().slice(0, 10);
    return { count: list.length, next: list.find((h) => h.date >= today) ?? null };
  });

  // How many holidays fall in each month: [Jan, Feb, ..., Dec]
  protected readonly monthCounts = computed(() => {
    const counts = new Array<number>(12).fill(0);
    for (const holiday of this.holidays()) {
      // "2026-01-01": characters 5 and 6 are the month
      const month = Number(holiday.date.slice(5, 7)) - 1;
      counts[month] = (counts[month] ?? 0) + 1;
    }
    return counts;
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: MONTHS },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{ type: 'bar', data: this.monthCounts() }],
  }));

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
