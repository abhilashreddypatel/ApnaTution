import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    error: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            role: ['PARENT', Validators.required],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            subjects: [''],
            location: ['']
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const formData = { ...this.registerForm.value };
            if (formData.role === 'TUTOR' && formData.subjects) {
                formData.subjects = formData.subjects.split(',').map((s: string) => s.trim());
            }

            this.authService.register(formData).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.error = 'Registration failed. Email might be taken.';
                }
            });
        }
    }
}
