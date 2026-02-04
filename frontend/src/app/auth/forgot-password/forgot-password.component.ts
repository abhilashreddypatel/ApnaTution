import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    message: string = '';
    error: string = '';
    loading: boolean = false;

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        if (this.forgotForm.valid) {
            this.loading = true;
            this.message = '';
            this.error = '';

            this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
                next: (res) => {
                    this.message = 'Email sent! Check your inbox for the reset link.';
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err.error.message || 'Failed to send email';
                    this.loading = false;
                }
            });
        }
    }
}
