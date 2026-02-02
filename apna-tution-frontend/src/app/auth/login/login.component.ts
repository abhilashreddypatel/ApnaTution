import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    error: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    const role = this.authService.getRole();
                    if (role === 'PARENT') {
                        this.router.navigate(['/parent/my-leads']);
                    } else if (role === 'TUTOR') {
                        this.router.navigate(['/tutor/leads']);
                    } else if (role === 'ADMIN') {
                        this.router.navigate(['/admin']);
                    } else {
                        this.router.navigate(['/']);
                    }
                },
                error: (err) => {
                    this.error = 'Invalid email or password';
                }
            });
        }
    }
}
