import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { RatesResponse } from '../../models/rates';
import { RatesService } from '../../services/rates-service';
import { CHART_COLORS } from '../../utils/chart-colors';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { BASE_CURRENCIES } from '../../utils/currencies';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-exchange-rate-widget',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    DecimalPipe,
    AgGridAngular,
    NgxEchartsDirective,
    MatSlideToggle,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './exchange-rate-widget.html',
  styleUrl: './exchange-rate-widget.scss',
})
export class ExchangeRateWidget {
  private readonly ratesService = inject(RatesService);

  // The base currency to start with. The user can change it with the dropdown.
  readonly base = input('SEK');
  // The currency to show. null means the country has none that we can look up.
  readonly target = input<string | null>('EUR');

  protected readonly currencies = BASE_CURRENCIES;

  // The base currency chosen in the dropdown. It starts as the base input.
  protected readonly selectedBase = linkedSignal(() => this.base());

  protected readonly data = signal<RatesResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // A currency cannot be compared with itself, e.g. SEK for a Swedish visitor looking at Sweden
  protected readonly sameCurrency = computed(
    () => this.target() !== null && this.selectedBase() === this.target(),
  );

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
          // lineStyle is the line itself, itemStyle also colours the dot in the tooltip
          lineStyle: { color: CHART_COLORS.accentYellow },
          itemStyle: { color: CHART_COLORS.accentYellow },
        },
      ],
    };
  });

  protected onBaseChange(event: MatSelectChange): void {
    this.selectedBase.set(event.value as string);
  }

  constructor() {
    effect((onCleanup) => {
      const base = this.selectedBase();
      const target = this.target();

      if (target === null || base === target) {
        this.data.set(null);
        this.error.set(null);
        this.loading.set(false);
        return;
      }

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
