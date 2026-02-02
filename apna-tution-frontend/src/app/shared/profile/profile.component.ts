import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    loading = true;
    saving = false;
    userRole: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            role: [{ value: '', disabled: true }],
            phone: [''],
            // Tutor specific
            tagline: [''],
            location: [''],
            experience: [''],
            hourlyRate: [''],
            mode: ['ONLINE']
        });
    }

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.loading = true;
        this.authService.getProfile().subscribe({
            next: (user) => {
                this.userRole = user.role;
                this.profileForm.patchValue(user);
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load profile', err);
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.saving = true;
            this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
                next: (updatedUser) => {
                    alert('Profile updated successfully!');
                    this.saving = false;
                },
                error: (err) => {
                    console.error('Update failed', err);
                    alert('Failed to update profile.');
                    this.saving = false;
                }
            });
        }
    }
}
