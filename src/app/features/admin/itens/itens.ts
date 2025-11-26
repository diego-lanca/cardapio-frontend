import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../../core/services/item-service';
import { MenuItem } from '../../../shared/models/menuItem';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-itens',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './itens.html',
  styleUrl: './itens.css',
})
export class Itens {
  items: MenuItem[] = [];
  loading = false;
  editingItem: any | null = null;
  form!: FormGroup;

  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadItems();
    this.form = this.fb.group({
      name: [''],
      price: [''],
      image: [null],
    });
  }

  loadItems() {
    this.loading = true;
    this.cdr.detectChanges();

    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error to load items: ', err);
        this.loading = false;
        this.cdr.detectChanges();
        
        this.snackBar.open('Erro ao carregar itens', 'Fechar', { duration: 3000 });
      },
    });
  }

  startEdit(item: MenuItem, dialogTemplate: any) {
    this.editingItem = item;
    this.form.patchValue({
      name: item.name,
      price: item.price,
      image: null,
    });

    // Abre o dialog
    this.dialog.open(dialogTemplate, {
      width: '500px',
      disableClose: false,
    });
  }

  cancelEdit() {
    this.editingItem = null;
    this.form.reset();
    this.dialog.closeAll();
  }

  saveEdit() {
    if (!this.editingItem) return;

    const payload = {
      name: this.form.value.name,
      price: this.form.value.price,
    };

    this.itemService.update(this.editingItem.id, payload).subscribe({
      next: () => {
        this.snackBar.open('Item atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.loadItems();
        this.cancelEdit();
      },
      error: (err: any) => {
        console.log('Error to update item: ', err);
        this.snackBar.open('Erro ao atualizar item', 'Fechar', { duration: 3000 });
      },
    });
  }

  delete(item: MenuItem) {
    if (confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      this.itemService.delete(item.id).subscribe({
        next: () => {
          this.snackBar.open('Item excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.loadItems();
        },
        error: (err: any) => {
          console.log('Error to delete item: ', err);
          this.snackBar.open('Erro ao excluir item', 'Fechar', { duration: 3000 });
        },
      });
    }
  }
}
