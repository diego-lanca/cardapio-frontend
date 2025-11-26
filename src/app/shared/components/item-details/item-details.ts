import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../models/menuItem';

export interface ItemDetailsData {
  item: MenuItem;
  sectionColor: string;
  sectionIcon: any;
}

@Component({
  selector: 'app-item-details',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css',
})
export class ItemDetails {
  quantity = 1;

  constructor(
    public dialogRef: MatDialogRef<ItemDetails>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDetailsData,
  ) {}

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotal(): number {
    return this.data.item.price * this.quantity;
  }

  addToCart(): void {
    this.dialogRef.close({
      item: this.data.item,
      quantity: this.quantity,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
