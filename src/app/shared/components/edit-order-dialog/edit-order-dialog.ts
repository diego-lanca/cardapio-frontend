import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-order-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-order-dialog.html',
  styleUrl: './edit-order-dialog.css',
})
export class EditOrderDialog {
  statuses = {
    pending: 'Pendente',
    confirmed: "Confirmado",
    preparing: 'Preparando',
    ready: 'Pronto',
    delivering: 'Saiu pra entrega',
    delivered: 'Finalizado',
    cancelled: 'Cancelado',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditOrderDialog>,
  ) {}

  save() {
    this.dialogRef.close(this.data.order);
  }

  close() {
    this.dialogRef.close(null);
  }
}
