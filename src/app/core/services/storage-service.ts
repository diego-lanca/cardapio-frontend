import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

type StorageType = 'localStorage' | 'sessionStorage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private authTokenSignal = signal<string | null>(
    this.isBrowser ? this.getItem('auth_token', 'localStorage') : null,
  );

  private cartSignal = signal<any[]>(
    this.isBrowser ? this.getItem('cart', 'localStorage') || [] : [],
  );

  authToken = this.authTokenSignal.asReadonly();
  cart = this.cartSignal.asReadonly();

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        this.setItem('auth_token', this.authTokenSignal(), 'localStorage');
      });

      effect(() => {
        this.setItem('cart', this.cartSignal(), 'localStorage');
      });
    }
  }

  setAuthToken(token: string | null): void {
    this.authTokenSignal.set(token);
  }

  setCart(cart: any[]): void {
    this.cartSignal.set(cart);
  }

  getItem<T = any>(key: string, type: StorageType = 'localStorage'): T | null {
    if (!this.isBrowser) return null;

    try {
      const storage = type === 'localStorage' ? localStorage : sessionStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from ${type}:`, error);
      return null;
    }
  }

  setItem(key: string, value: any, type: StorageType = 'localStorage'): void {
    if (!this.isBrowser) return;

    try {
      const storage = type === 'localStorage' ? localStorage : sessionStorage;

      if (value === null || value === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting ${key} in ${type}:`, error);
    }
  }

  removeItem(key: string, type: StorageType = 'localStorage'): void {
    if (!this.isBrowser) return;

    try {
      const storage = type === 'localStorage' ? localStorage : sessionStorage;
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from ${type}:`, error);
    }
  }

  clear(type: StorageType = 'localStorage'): void {
    if (!this.isBrowser) return;

    try {
      const storage = type === 'localStorage' ? localStorage : sessionStorage;
      storage.clear();
    } catch (error) {
      console.error(`Error clearing ${type}:`, error);
    }
  }

  clearAll(): void {
    this.authTokenSignal.set(null);
    this.cartSignal.set([]);
    this.clear('localStorage');
    this.clear('sessionStorage');
  }
}
