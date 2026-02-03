import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        private authService: AuthService,
        private cdr: ChangeDetectorRef
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
        console.log('ProfileComponent: Loading profile...');
        this.loading = true;
        this.authService.getProfile().subscribe({
            next: (user) => {
                console.log('ProfileComponent: Profile loaded', user);
                this.userRole = user.role;
                this.profileForm.patchValue(user);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('ProfileComponent: Failed to load profile', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.saving = true;
            this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
                next: (updatedUser) => {
                    console.log('ProfileComponent: Profile updated', updatedUser);
                    alert('Profile updated successfully!');
                    this.saving = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('ProfileComponent: Update failed', err);
                    alert('Failed to update profile.');
                    this.saving = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }
}
