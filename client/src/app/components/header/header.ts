import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Country } from '../../models/country';
import { AuthService } from '../../services/auth-service';
import { CountryPicker } from '../country-picker/country-picker';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
    CountryPicker,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // The current address as a signal, updated after every navigation
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  // The home page has its own big search, so the header shows one on every other page
  protected readonly showSearch = computed(() => this.url().split(/[?#]/)[0] !== '/');

  // true = the icon has been clicked and the search box is showing
  protected readonly searchOpen = signal(false);

  constructor() {
    // Whenever we go to another page, fold the search back into an icon
    effect(() => {
      this.url();
      this.searchOpen.set(false);
    });
  }

  protected openCountry(country: Country): void {
    this.searchOpen.set(false);
    void this.router.navigate(['/country', country.code]);
  }

  // Runs when focus leaves the search box (clicking elsewhere, tabbing away)
  protected onSearchFocusOut(search: HTMLElement): void {
    // Wait a moment: clicking an option in the dropdown also moves focus for an instant
    setTimeout(() => {
      if (!search.contains(document.activeElement)) {
        this.searchOpen.set(false);
      }
    }, 200);
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }
}
