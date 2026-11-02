import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private readonly auth = inject(AuthService);

  // The logged-in user's favourite country codes, e.g. ['SE', 'NO']
  readonly codes = signal<string[]>([]);

  constructor() {
    // Runs again whenever auth.user() changes (login, logout, session restored)
    effect(() => {
      if (this.auth.user()) {
        void this.load();
      } else {
        this.codes.set([]);
      }
    });
  }

  private async load(): Promise<void> {
    // No filter needed: RLS only returns rows where user_id is the logged-in user
    const { data, error } = await this.auth.supabase.from('favourites').select('country_code');

    if (error) {
      console.error('Could not load favourites', error.message);
      return;
    }
    this.codes.set(data.map((row) => row.country_code as string));
  }

  isFavourite(code: string): boolean {
    return this.codes().includes(code);
  }

  async add(code: string): Promise<void> {
    // user_id is filled in by the database (default auth.uid()), so we only send the country
    const { error } = await this.auth.supabase.from('favourites').insert({ country_code: code });

    if (error) {
      console.error('Could not add favourite', error.message);
      return;
    }
    this.codes.update((list) => [...list, code]);
  }

  async remove(code: string): Promise<void> {
    // RLS guarantees we can only delete our own row, even without a user_id filter
    const { error } = await this.auth.supabase
      .from('favourites')
      .delete()
      .eq('country_code', code);

    if (error) {
      console.error('Could not remove favourite', error.message);
      return;
    }
    this.codes.update((list) => list.filter((c) => c !== code));
  }
}
