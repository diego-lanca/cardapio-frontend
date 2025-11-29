import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Menu } from '../../menu/menu';

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
    FormsModule
  ],
  templateUrl: './itens.html',
  styleUrl: './itens.css',
})
export class Itens {
  items: MenuItem[] = [];
  loading = false;
  editingItem: any | null = null;
  form!: FormGroup;
  selectedImageFile: File | null = null;
  previewImage: string | null = null;
  search: string = '';
  filteredItems: MenuItem[] = [];

  displayedColumns = ['image', 'name', 'price', 'category', 'actions'];

  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadItems();

    this.form = this.fb.group({
      name: [''],
      description: [''],
      price: [0],
      category: [''],
      image_url: [null],
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImageFile = file;

    // preview instantâneo
    const reader = new FileReader();
    reader.onload = () => (this.previewImage = reader.result as string);
    reader.readAsDataURL(file);
    this.cdr.detectChanges();
  }

  loadItems() {
    this.loading = true;
    this.cdr.detectChanges();

    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = [...this.items];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('Error to load items: ', err);
        this.loading = false;
        this.snackBar.open('Erro ao carregar itens', 'Fechar', { duration: 3000 });
      },
    });
  }

  applyFilter() {
    const value = this.search.trim().toLowerCase();

    if (!value) {
      this.filteredItems = this.items;
      return;
    }

    this.filteredItems = this.items.filter(
      (item) =>
        item.name.toLowerCase().includes(value) || item.category.toLowerCase().includes(value),
    );
  }

  startEdit(item: MenuItem, dialogTemplate: any) {
    this.editingItem = item;

    this.form.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: null,
    });

    this.previewImage = null;
    this.selectedImageFile = null;

    this.dialog.open(dialogTemplate, {
      width: '550px',
      disableClose: false,
    });
  }

  cancelEdit() {
    this.editingItem = null;
    this.form.reset();
    this.previewImage = null;
    this.selectedImageFile = null;
    this.dialog.closeAll();
  }

  saveEdit() {
    if (!this.editingItem) return;

    const basePayload = {
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      category: this.form.value.category,
      image_url: this.editingItem.image_url,
    };

    if (!this.selectedImageFile) {
      this.updateItem(basePayload);
      return;
    }

    this.itemService.uploadItemImage(this.selectedImageFile).subscribe({
      next: (res: any) => {
        const payload = { ...basePayload, image_url: res.url };
        this.updateItem(payload);
      },
      error: () => {
        this.snackBar.open('Erro ao enviar imagem', 'Fechar', { duration: 3000 });
      },
    });
  }

  private updateItem(payload: Omit<MenuItem, 'id'>) {
    this.itemService.updateItem(this.editingItem!.id, payload).subscribe({
      next: (item) => {
        this.snackBar.open('Item atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.loadItems();
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Erro ao atualizar item: ', err);
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
        error: () => {
          this.snackBar.open('Erro ao excluir item', 'Fechar', { duration: 3000 });
        },
      });
    }
  }
}
