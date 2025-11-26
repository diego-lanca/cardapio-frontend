import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem } from '../../shared/models/cartItem';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storageService = inject(StorageService);
  private cartSignal = signal<CartItem[]>([]);

  cart = this.cartSignal.asReadonly();
  total = computed(() => this.cart().reduce((sum, item) => sum + item.price * item.qty, 0));
  qtdItens = computed(() => this.cart().reduce((sum, item) => sum + item.qty, 0));
  isEmpty = computed(() => this.cart().length === 0);

  constructor() {
    // Carrega o carrinho do storage
    const savedCart = this.storageService.cart();
    if (savedCart && savedCart.length > 0) {
      this.cartSignal.set(savedCart);
    }

    // Sincroniza automaticamente com o storage
    effect(() => {
      this.storageService.setCart(this.cartSignal());
    });
  }

  addToCart(item: CartItem) {
    const items = this.cartSignal();
    const existing = items.find((i) => i.id === item.id);

    if (existing) {
      this.cartSignal.update((current) =>
        current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + item.qty } : cartItem,
        ),
      );
    } else {
      this.cartSignal.update((current) => [...current, { ...item, qty: item.qty }]);
    }
  }

  removeFromCart(id: number) {
    this.cartSignal.update((current) => current.filter((item) => item.id !== id));
  }

  updateQuantity(id: number, qty: number) {
    if (qty <= 0) {
      this.removeFromCart(id);
      return;
    }

    this.cartSignal.update((current) =>
      current.map((item) => (item.id === id ? { ...item, qty } : item)),
    );
  }

  incrementQuantity(id: number) {
    this.cartSignal.update((current) =>
      current.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  }

  decrementQuantity(id: number) {
    this.cartSignal.update((current) =>
      current
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty - 1;
            return newQty > 0 ? { ...item, qty: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.id !== id || item.qty > 0),
    );
  }

  clearCart() {
    this.cartSignal.set([]);
  }

  getCartSummary() {
    return {
      items: this.cart(),
      total: this.total(),
      quantity: this.qtdItens(),
      isEmpty: this.isEmpty(),
    };
  }
}
