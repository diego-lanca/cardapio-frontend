import { Component, Inject, signal } from '@angular/core';
import {
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.css',
})
export class LoginDialog {
  isLogin = signal(true);

  loading = signal(false);

  registerForm: FormGroup;
  loginForm: FormGroup;

  loginError = signal<string | null>(null);
  registerError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group(
      {
        full_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        is_admin: false,
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  submit() {
    if (this.isLogin()) {
      if (this.loginForm.invalid || this.loading()) return;

      this.loading.set(true);
      this.loginError.set(null);

      const { username, password } = this.loginForm.value;

      this.auth.login(username!, password!).subscribe({
        next: () => {
          this.loading.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading.set(false);
          this.loginError.set('Usuário ou senha inválidos');
        },
      });
    } else {
      if (this.registerForm.invalid || this.loading()) return;

      this.loading.set(true);
      this.registerError.set(null);

      const newUser = this.registerForm.value;

      this.auth.register(newUser).subscribe({
        next: () => {
          this.loading.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading.set(false);
          this.loginError.set('Ocorreu um erro ao criar esse usuário.');
        },
      });
    }
  }
}
