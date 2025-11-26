import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { faMugHot, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { LoginDialog } from '../login-dialog/login-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FaIconComponent, MatButtonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  constructor(private dialog: MatDialog, private router: Router) {}

  // Signal readonly com os itens
  cart = this.cartService.cart;
  cartItems = this.cartService.qtdItens;
  isMobileMenuOpen = false;
  user = this.authService.user;

  faMugHot = faMugHot;
  faCartShopping = faCartShopping;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  openLoginModal() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Login realizado!');
      }
    });
  }

  getUserFirstName(full_name: string | undefined) {
    if (!full_name) return 'Usuário';

    return full_name.split(' ')[0];
  }

  goToCart() {
    this.router.navigateByUrl('/cart')
  }
}
