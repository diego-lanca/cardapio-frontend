import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faAdd,
  faClose,
  faInfoCircle,
  faUsd,
  faImage,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import { ItemService } from '../../../../core/services/item-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item',
  imports: [
    ReactiveFormsModule,
    FaIconComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    CommonModule,
  ],
  templateUrl: './add-item.html',
  styleUrl: './add-item.css',
})
export class AddItem {
  faAdd = faAdd;
  faClose = faClose;
  faInfoCircle = faInfoCircle;
  faUsd = faUsd;
  faImage = faImage;

  form!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      isActive: [true],
    });
  }

  onPriceInput(event: any) {
    let raw = event.target.value.replace(/\D/g, ''); // só números

    if (raw.length === 0) {
      this.form.get('price')?.setValue('');
      return;
    }

    // converte para número em reais (centavos)
    const numericValue = parseInt(raw, 10) / 100;

    // salva no formulário com ponto (19.90)
    this.form.get('price')?.setValue(numericValue.toFixed(2), { emitEvent: false });

    // formata para exibir no input → R$ 19,90
    const masked = numericValue.toFixed(2).replace('.', ','); // vírgula no input

    event.target.value = `R$ ${masked}`;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const item = this.form.value;

    this.itemService.newItem(item).subscribe({
      next: () => {
        this.form.reset();
        this.snackBar.open('Item cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Erro ao criar item', err);
        this.snackBar.open('Ocorreu um erro ao criar o item.', 'Fechar', { duration: 3000 });
      },
    });
  }
}
