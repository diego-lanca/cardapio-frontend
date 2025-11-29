import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { User } from '../../../shared/models/user';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users: User[] = [];
  loading = false;
  form!: FormGroup;
  editingUser: User | null = null;
  search: string = '';
    filteredUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cdk: ChangeDetectorRef,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      isAdmin: [false],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.cdk.markForCheck();

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users]
        this.loading = false;
        this.cdk.markForCheck();
      },
      error: (err) => {
        console.log('Error on loading users: ' + err);
        this.loading = false;
      },
    });
  }

  applyFilter() {
    const value = this.search.trim().toLowerCase();

    if (!value) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(value) || user.username.toLowerCase().includes(value),
    );
  }

  startEdit(user: User, templateRef: TemplateRef<any>): void {
    this.editingUser = user;
    this.form.patchValue({
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      isAdmin: user.is_admin,
    });
    this.dialog.open(templateRef, {
      width: '600px',
      disableClose: true,
    });
  }

  saveEdit(): void {
    if (this.form.invalid || !this.editingUser) {
      return;
    }
    const formValues = this.form.value;

    const changedValues: Record<string, any> = {};

    for (const key in formValues) {
      if (formValues[key] !== (this.editingUser as any)[key]) {
        changedValues[key] = formValues[key];
      }
    }

    if (Object.keys(changedValues).length === 0) {
      this.dialog.closeAll();
      return;
    }

    this.userService.updateUser(this.editingUser.id, changedValues).subscribe({
      next: (updatedUser) => {
        // Atualiza a lista local
        const index = this.users.findIndex((u) => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...updatedUser,
          };
        }

        console.log('Usuário atualizado:', updatedUser);

        this.dialog.closeAll();
        this.editingUser = null;
        this.form.reset();
        this.cdk.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao atualizar usuário:', err);
      },
    });
  }

  cancelEdit(): void {
    this.dialog.closeAll();
    this.editingUser = null;
    this.form.reset();
  }

  delete(user: User): void {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.full_name}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        // remove da lista local
        this.users = this.users.filter((u) => u.id !== user.id);

        this.cdk.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
        alert('Erro ao excluir usuário.');
      },
    });
  }

  getDefaultAvatar(): string {
    return 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=150';
  }
}
