import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    token: string = '';
    message: string = '';
    error: string = '';
    loading: boolean = false;
    showPassword: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.token = this.route.snapshot.paramMap.get('token') || '';
        if (!this.token) {
            this.error = 'Invalid token';
        }
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.resetForm.valid && this.token) {
            this.loading = true;
            this.message = '';
            this.error = '';

            this.authService.resetPassword(this.token, this.resetForm.value.password).subscribe({
                next: (res) => {
                    this.message = 'Password reset successful! Redirecting to login...';
                    this.loading = false;
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 3000);
                },
                error: (err) => {
                    this.error = err.error.message || 'Failed to reset password';
                    this.loading = false;
                }
            });
        }
    }
}
