import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RatesResponse } from '../../models/rates';
import { RatesService } from '../../services/rates-service';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { MatSlideToggle } from '@angular/material/slide-toggle';


echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-exchange-rate-widget',
  imports: [DecimalPipe, AgGridAngular, NgxEchartsDirective, MatSlideToggle],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './exchange-rate-widget.html',
  styleUrl: './exchange-rate-widget.scss',
})
export class ExchangeRateWidget {
  private readonly ratesService = inject(RatesService);

  readonly base = input('SEK');
  readonly target = input('EUR');

  protected readonly data = signal<RatesResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // The last 7 days, newest first
  protected readonly recent = computed(() => this.data()?.history.slice(-7).reverse() ?? []);

    protected readonly columnDefs: ColDef[] = [
    { field: 'date', headerName: 'Date', sortable: true, filter: true },
    { field: 'rate', headerName: 'Rate', sortable: true, filter: 'agNumberColumnFilter' },
  ];

protected readonly showTable = signal(false);

  protected readonly chartOptions = computed<EChartsOption>(() => {
  const history = this.data()?.history ?? [];
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: history.map((p) => p.date) },
    yAxis: { type: 'value', scale: true },
    series: [
      {
        type: 'line',
        data: history.map((p) => p.rate),
        smooth: true,
        showSymbol: false,
      },
    ],
  };
});


  constructor() {
    effect((onCleanup) => {
      const base = this.base();
      const target = this.target();

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.ratesService.getRates(base, target).subscribe({
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

      onCleanup(() => subscription.unsubscribe());
    });
  }
}