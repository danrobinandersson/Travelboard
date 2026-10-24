import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ExchangeRateWidget } from './components/exchange-rate-widget/exchange-rate-widget';
import { CountryPicker } from './components/country-picker/country-picker';
import { Country } from './models/country';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ExchangeRateWidget, CountryPicker],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('client');
  protected readonly selected = signal<Country | null>(null);
  protected readonly currency = computed(() => this.selected()?.currencies[0]?.code ?? null);
}
