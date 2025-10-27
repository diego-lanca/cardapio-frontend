import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {
  faSeedling,
  faWater,
  faBurger,
  faIceCream,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
}

interface MenuSection {
  name: string;
  icon: any;
  color: string;
  items: MenuItem[];
}

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
      name: 'Salada Caesar',
      description: 'Alface americano, croutons, parmesão e molho caesar',
      price: 23.5,
      category: 'Entradas',
    },
    {
      name: 'Bruschetta',
      description: 'Pão italiano tostado com tomate, manjericão e azeite',
      price: 18.9,
      category: 'Entradas',
    },
    {
      name: 'Caprese',
      description: 'Mussarela de búfala, tomate e manjericão fresco',
      price: 22.0,
      category: 'Entradas',
    },
    {
      name: 'Espresso',
      description: 'Café expresso encorpado e aromático',
      price: 8.0,
      category: 'Bebidas',
    },
    {
      name: 'Cappuccino',
      description: 'Espresso com leite vaporizado e espuma cremosa',
      price: 12.0,
      category: 'Bebidas',
    },
    {
      name: 'Latte',
      description: 'Café com leite e toque de baunilha',
      price: 14.0,
      category: 'Bebidas',
    },
    {
      name: 'Hambúrguer Artesanal',
      description: 'Blend de carnes nobres, queijo, alface e tomate',
      price: 38.0,
      category: 'Pratos Principais',
    },
    {
      name: 'Risoto de Funghi',
      description: 'Arroz arbóreo com mix de cogumelos frescos',
      price: 42.0,
      category: 'Pratos Principais',
    },
    {
      name: 'Tiramisu',
      description: 'Sobremesa italiana com café, mascarpone e cacau',
      price: 16.0,
      category: 'Sobremesas',
    },
    {
      name: 'Brownie com Sorvete',
      description: 'Brownie de chocolate com sorvete de creme',
      price: 18.0,
      category: 'Sobremesas',
    },
    {
      name: 'Cookie Artesanal',
      description: 'Cookie caseiro com gotas de chocolate',
      price: 8.5,
      category: 'Sobremesas',
    },
  ];

  sections: MenuSection[] = [];

  // Mapa de ícones e cores por categoria
  private categoryConfig: { [key: string]: { icon: any; color: string } } = {
    Entradas: { icon: faSeedling, color: '#10b981' },
    Bebidas: { icon: faWater, color: '#8b5cf6' },
    'Pratos Principais': { icon: faBurger, color: '#f59e0b' },
    Sobremesas: { icon: faIceCream, color: '#ec4899' },
    Default: { icon: faUtensils, color: '#6b7280' },
  };

  ngOnInit() {
    this.groupItemsByCategory();
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

    // Converte para array de seções
    this.sections = Object.entries(grouped).map(([categoryName, items]) => {
      const config = this.categoryConfig[categoryName] || this.categoryConfig['Default'];
      return {
        name: categoryName,
        icon: config.icon,
        color: config.color,
        items: items,
      };
    });
  }
}
