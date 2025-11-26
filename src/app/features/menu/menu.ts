import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import {
  faBurger,
  faUtensils,
  faDrumstickBite,
  faBowlFood,
  faCarrot,
  faConciergeBell,
  faMugHot,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, registerLocaleData, CommonModule } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MenuItem } from '../../shared/models/menuItem';
import { MenuSection } from '../../shared/models/menuSection';
import { CartService } from '../../core/services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemService } from '../../core/services/item-service';
import { ChangeDetectorRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetails } from '../../shared/components/item-details/item-details';

registerLocaleData(localePt);

@Component({
  selector: 'app-menu',
  imports: [FaIconComponent, CurrencyPipe, MatProgressSpinnerModule, CommonModule],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  sections: MenuSection[] = [];
  loading: boolean = true;
  private destroy$ = new Subject<void>();

  private categoryConfig: {
    [key: string]: { icon: any; color: string };
  } = {
    Assados: { icon: faDrumstickBite, color: '#f87171' },
    Massas: { icon: faBowlFood, color: '#fbbf24' },
    Acompanhamentos: { icon: faCarrot, color: '#34d399' },
    'Pratos do Dia': { icon: faConciergeBell, color: '#60a5fa' },
    Caldos: { icon: faMugHot, color: '#f97316' },
    'Pratos Principais': { icon: faBurger, color: '#f59e0b' },
    Porções: { icon: faUtensils, color: '#a78bfa' },
    Default: { icon: faUtensils, color: '#6b7280' },
  };

  constructor(
    private cartService: CartService,
    private itemService: ItemService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  addQuickItem(event: Event, item: MenuItem) {
    event.stopPropagation();
    this.cartService.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1
    });
    this.snackbar.open('Produto adicionado ao carrinho!', 'Fechar', { duration: 2000 });
  }

  addItemWithQuantity(item: MenuItem, qty: number) {
    this.cartService.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      qty,
    });
    this.snackbar.open('Produto adicionado ao carrinho!', 'Fechar', { duration: 2000 });
  }

  ngOnInit() {
    this.loadItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openItemDetailsDialog(item: any, section: any): void {
    const dialogRef = this.dialog.open(ItemDetails, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        item: item,
        sectionColor: section.color,
        sectionIcon: section.icon,
      },
      panelClass: 'product-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addItemWithQuantity(result.item, result.quantity);
      }
    });
  }

  scrollToSection(section: any) {
    const id = section.name.toLowerCase().replace(/ /g, '-');
    const el = document.getElementById(id);
    if (!el) return;

    const navbar = document.getElementById('mini-navbar');
    const offset = navbar ? navbar.offsetHeight + 10 : 60;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }

  private loadItems() {
    this.sections = [];
    this.loading = true;
    this.cdr.markForCheck();

    this.itemService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          if (!items || items.length === 0) {
            this.loading = false;
            this.cdr.markForCheck();
            return;
          }

          this.items = items;
          this.groupItemsByCategory();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao carregar itens:', err);
          this.loading = false;
          this.sections = [];
          this.cdr.markForCheck();
          this.snackbar.open('Ocorreu um erro ao carregar os produtos.', 'Fechar', {
            duration: 3000,
          });
        },
      });
  }

  private groupItemsByCategory() {
    const grouped = this.items.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as { [key: string]: MenuItem[] },
    );

    this.sections = Object.entries(grouped).map(([cn, i]) => {
      const config = this.categoryConfig[cn] || this.categoryConfig['Default'];
      return {
        name: cn,
        icon: config.icon,
        color: config.color,
        items: i,
      };
    });

    this.cdr.markForCheck();
  }
}
