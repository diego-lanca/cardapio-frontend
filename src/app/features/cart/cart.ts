import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart-service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private cartService = inject(CartService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);

  cart = this.cartService.cart;
  total = this.cartService.total;
  isEmpty = this.cartService.isEmpty;
  qtdItens = this.cartService.qtdItens;

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

  checkout() {
    if (this.cart().length === 0) {
      this.snackbar.open('Carrinho vazio!', 'Fechar', { duration: 2000 });
      return;
    }
    // Redireciona para checkout ou página de pagamento
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/menu']);
  }
}
