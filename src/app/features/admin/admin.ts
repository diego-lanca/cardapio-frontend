import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  isRootRoute = true;

  constructor(private router: Router) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isRootRoute = this.router.url === '/admin';
    });
  }

  list(tipo: string) {
    console.log('Listando:', tipo);
  }

  add(tipo: string) {
    console.log('Adicionar:', tipo);
  }
}
