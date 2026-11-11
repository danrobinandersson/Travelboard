import { Injectable, computed, effect, signal } from '@angular/core';

const MAX_COUNTRIES = 3;
const STORAGE_KEY = 'travelboard.compare';

// Reads the saved codes. Anything unexpected (empty, broken JSON, no access) gives an empty list.
function loadSaved(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((code): code is string => typeof code === 'string' && /^[A-Z]{2}$/.test(code))
      .slice(0, MAX_COUNTRIES);
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class CompareService {
  // The country codes picked for comparison, e.g. ['SE', 'NO']
  readonly codes = signal<string[]>(loadSaved());

  readonly isFull = computed(() => this.codes().length >= MAX_COUNTRIES);

  constructor() {
    // Save every change, so the picks survive a page refresh
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes()));
      } catch {
        // Storage can be blocked (private mode, full). The list still works in memory.
      }
    });
  }

  has(code: string): boolean {
    return this.codes().includes(code);
  }

  toggle(code: string): void {
    if (this.has(code)) {
      this.codes.update((list) => list.filter((c) => c !== code));
    } else if (!this.isFull()) {
      this.codes.update((list) => [...list, code]);
    }
  }

  clear(): void {
    this.codes.set([]);
  }
}
