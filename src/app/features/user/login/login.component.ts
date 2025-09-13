
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    
    this.authService.login(email).subscribe({
      next: (response) => {
        
        this.tokenService.saveToken(response.token);
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
       
        if (err.status === 404) {
          this.handleUserNotFound(email);
        } else {
          this.showError('Ocurrió un error inesperado. Inténtalo de nuevo.');
        }
      }
    });
  }

  private handleUserNotFound(email: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.registerAndLogin(email);
      }
    });
  }
  
  private registerAndLogin(email: string): void {
    this.authService.createUser(email).subscribe({
      next: () => {
        this.authService.login(email).subscribe(res => {
            this.tokenService.saveToken(res.token);
            this.router.navigate(['/tasks']);
            this.showError(`¡Bienvenido, ${email}! Tu cuenta ha sido creada.`);
        });
      },
      error: () => {
        this.showError('No se pudo crear la cuenta. El correo quizás ya existe.');
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}