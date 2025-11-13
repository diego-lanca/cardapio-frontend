import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../shared/models/cartItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSignal = signal<CartItem[]>([]);

  cart = this.cartSignal.asReadonly();

  total = computed(() => this.cart().reduce((sum, item) => sum + item.price * item.qty, 0));

  qtdItens = computed(() => this.cart().reduce((sum, item) => sum + item.qty, 0));

  addToCart(product: Omit<CartItem, 'qty'>) {
    const items = this.cartSignal();
    const existing = items.find((i) => i.id === product.id);

    if (existing) {
      this.cartSignal.update((current) =>
        current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)),
      );
    } else {
      this.cartSignal.update((current) => [...current, { ...product, qty: 1 }]);
    }
  }

  removeFromCart(id: number) {
    this.cartSignal.update((current) => current.filter((item) => item.id !== id));
  }

  clearCart() {
    this.cartSignal.set([]);
  }
}
