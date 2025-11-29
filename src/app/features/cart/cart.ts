import { Component, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart-service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order-service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { NewOrder, NewOrderItem } from '../../shared/models/order';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  private snackbar = inject(MatSnackBar);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);

  cart = this.cartService.cart;
  total = this.cartService.total;
  isEmpty = this.cartService.isEmpty;
  qtdItens = this.cartService.qtdItens;

  isCheckingOut = signal(false);

  ngOnInit() {}

  incrementQuantity(id: number) {
    this.cartService.incrementQuantity(id);
  }

  decrementQuantity(id: number) {
    this.cartService.decrementQuantity(id);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.snackbar.open('Produto removido do carrinho', 'Fechar', { duration: 2000 });
  }

  updateQuantity(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const qty = parseInt(input.value, 10);
    if (qty > 0) {
      this.cartService.updateQuantity(id, qty);
    }
  }

  clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.cartService.clearCart();
      this.snackbar.open('Carrinho limpo', 'Fechar', { duration: 2000 });
    }
  }

  async checkout() {
    if (this.cart().length === 0) {
      this.snackbar.open('Carrinho vazio!', 'Fechar', { duration: 2000 });
      return;
    }

    this.isCheckingOut.set(true);

    try {
      const newOrder: NewOrder = {
        user_id: this.auth.user()?.id!,
        items: this.cart().map<NewOrderItem>((item) => {
          return {
            item_id: item.id,
            quantity: item.qty,
            observation: '',
          };
        }),
      };

      const orderId = await firstValueFrom(this.orderService.createOrder(newOrder));

      this.snackbar.open('Pedido criado com sucesso!', 'Fechar', { duration: 2000 });
      this.cartService.clearCart();
      this.router.navigate(['/orders']);
    } catch (error) {
      this.snackbar.open('Erro ao criar pedido. Tente novamente.', 'Fechar', { duration: 3000 });
      console.error('Erro no checkout:', error);
    } finally {
      this.isCheckingOut.set(false);
    }
  }

  continueShopping() {
    this.router.navigate(['/menu']);
  }

  get isAuthenticated() {
    return !!this.auth.user()?.id;
  }
}
