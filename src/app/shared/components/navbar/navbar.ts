import { Component, inject } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { MatButtonModule } from "@angular/material/button"
import { faMugHot, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../../core/services/cartService';

@Component({
  selector: 'app-navbar',
  imports: [FaIconComponent, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private cartService = inject(CartService);

  // Signal readonly com os itens
  cart = this.cartService.cart;

  isMobileMenuOpen = false;

  cartItems = this.cartService.qtdItens;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  faMugHot = faMugHot;
  faCartShopping = faCartShopping;
}
