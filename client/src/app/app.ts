import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ExchangeRateWidget } from './components/exchange-rate-widget/exchange-rate-widget';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ExchangeRateWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('client');
}
