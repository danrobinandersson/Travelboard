import { Injectable, signal } from '@angular/core';
import { createClient, type User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Exposed so other services (favourites) can query the database as the logged-in user
  readonly supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  // undefined = still checking the stored session, null = logged out
  readonly user = signal<User | null | undefined>(undefined);

  constructor() {
    // Fires once at start (restored session) and again on login/logout
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  async register(email: string, password: string): Promise<string | null> {
    const { error } = await this.supabase.auth.signUp({ email, password });
    return error?.message ?? null;
  }

  async login(email: string, password: string): Promise<string | null> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}
