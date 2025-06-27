import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ToastService } from '@core/services';
import { OmdLogoComponent } from '@shared/icons';
import { primeNGModules } from '@shared/primeng/primeng';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OmdLogoComponent, FormsModule, ReactiveFormsModule, RouterModule, primeNGModules],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly _authService: AuthService,
    private readonly _toastService: ToastService,
  ) {
    this.loginForm = this.fb.group({
      username: ['sebas2', [Validators.required]],
      password: ['sebas123', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value).subscribe({
        next: () => {
          this._toastService.showToast(
            'success',
            'Inicio de sesión exitoso.',
            '¡Bienvenido de vuelta!',
          );
          this.router.navigateByUrl('/home');
        },
        error: (err: any) => {
          this._toastService.showToast('error', 'Error en el inicio de sesión.', err.message);
        },
      });
    }
  }
}
