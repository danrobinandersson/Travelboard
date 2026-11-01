import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly registerMode = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly info = signal<string | null>(null);

  protected async submit(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    this.info.set(null);

    const message = this.registerMode()
      ? await this.auth.register(this.email(), this.password())
      : await this.auth.login(this.email(), this.password());

    this.busy.set(false);

    if (message) {
      this.error.set(message);
    } else if (this.registerMode() && !this.auth.user()) {
      // Email confirmation is on: Supabase created the user but there is no session yet
      this.info.set('Check your email to confirm your account, then log in.');
    } else {
      await this.router.navigateByUrl('/');
    }
  }
}
