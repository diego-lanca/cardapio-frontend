import { Component, LOCALE_ID, OnInit } from '@angular/core';
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
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MenuItem } from '../../shared/models/menuItem';
import { MenuSection } from '../../shared/models/menuSection';
import { CartService } from '../../core/services/cartService';
import { MatSnackBar } from '@angular/material/snack-bar';

registerLocaleData(localePt);

@Component({
  selector: 'app-menu',
  imports: [FaIconComponent, CurrencyPipe],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  items: MenuItem[] = [
    {
      id: 1,
      name: 'Frango Assado com Batata',
      description: 'Frango assado no forno acompanhado de batatas douradas',
      price: 45.0,
      category: 'Assados',
      image: '/menu/frango-assado.jpg',
    },
    {
      id: 2,
      name: 'Pernil Assado',
      description: 'Pernil suíno assado lentamente e temperado',
      price: 48.0,
      category: 'Assados',
      image: '/menu/pernil.jpg',
    },
    {
      id: 3,
      name: 'Joelho Suíno',
      description: 'Joelho suíno assado, crocante e suculento',
      price: 42.0,
      category: 'Assados',
      image: '/menu/joelho.jpg',
    },
    {
      id: 4,
      name: 'Costela Assada',
      description: 'Costela bovina assada no forno, macia e saborosa',
      price: 52.0,
      category: 'Assados',
      image: '/menu/costela.jpg',
    },
    {
      id: 5,
      name: 'Inhoque',
      description: 'Inhoque caseiro ao molho de tomate',
      price: 22.0,
      category: 'Massas',
      image: '/menu/innoque.jpg',
    },
    {
      id: 6,
      name: 'Maionese Caseira',
      description: 'Maionese de batata tradicional da casa',
      price: 18.0,
      category: 'Acompanhamentos',
      image: '/menu/maionese.jpg',
    },
    {
      id: 7,
      name: 'Copa Lombo',
      description: 'Copa lombo suíno assado e temperado',
      price: 44.0,
      category: 'Assados',
      image: '/menu/copa-lombo.jpg',
    },
    {
      id: 8,
      name: 'Feijoada',
      description: 'Feijoada completa com carnes selecionadas',
      price: 28.0,
      category: 'Pratos do Dia',
      image: '/menu/feijoada.jpg',
    },
    {
      id: 9,
      name: 'Cuscuz Paulista',
      description: 'Cuscuz paulista tradicional com frango e legumes',
      price: 20.0,
      category: 'Pratos do Dia',
      image: '/menu/cuscuz.jpg',
    },
    {
      id: 10,
      name: 'Caldo de Mandioca com Costela',
      description: 'Caldo cremoso de mandioca com costela bovina',
      price: 18.0,
      category: 'Caldos',
      image: '/menu/caldo-mandioca.jpg',
    },
    {
      id: 11,
      name: 'Parmegiana',
      description: 'Filé à parmegiana com molho de tomate e queijo',
      price: 36.0,
      category: 'Pratos Principais',
      image: '/menu/parmegiana.jpg',
    },
    {
      id: 12,
      name: 'Filé de Tilápia Frito',
      description: 'Tilápia frita crocante e temperada',
      price: 32.0,
      category: 'Porções',
      image: '/menu/tilapia.jpg',
    },
    {
      id: 13,
      name: 'Galinhada',
      description: 'Arroz com frango temperado e açafrão',
      price: 24.0,
      category: 'Pratos do Dia',
      image: '/menu/galinhada.jpg',
    },
    {
      id: 14,
      name: 'Dobradinha',
      description: 'Dobradinha tradicional com grão-de-bico',
      price: 26.0,
      category: 'Pratos do Dia',
      image: '/menu/dobradinha.jpg',
    },
    {
      id: 15,
      name: 'Torresmo',
      description: 'Torresmo crocante preparado na hora',
      price: 14.0,
      category: 'Porções',
      image: '/menu/torresmo.jpg',
    },
  ];

  sections: MenuSection[] = [];

  // Mapa de ícones e cores por categoria
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
    private snackbar: MatSnackBar,
  ) {}

  addProduct(product: MenuItem) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    });

    this.snackbar.open('Produto adicionado ao carrinho!', 'Fechar', { duration: 2000 });
  }

  ngOnInit() {
    this.groupItemsByCategory();
  }

  scrollToSection(section: any) {
    const id = section.name.toLowerCase().replace(/ /g, '-');
    const el = document.getElementById(id);

    if (!el) return;

    // Altura da navbar fixa
    const navbar = document.getElementById('mini-navbar');
    const offset = navbar ? navbar.offsetHeight + 10 : 60; // fallback

    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }

  private groupItemsByCategory() {
    // Agrupa itens por categoria
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

    // Converte para array das seções separadas
    this.sections = Object.entries(grouped).map(([cn, i]) => {
      const config = this.categoryConfig[cn] || this.categoryConfig['Default'];
      return {
        name: cn,
        icon: config.icon,
        color: config.color,
        items: i,
      };
    });
  }
}
