import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../core/services/lead.service';

@Component({
    selector: 'app-create-lead',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './create-lead.component.html',
    styleUrl: './create-lead.component.css'
})
export class CreateLeadComponent {
    leadForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private leadService: LeadService,
        private router: Router
    ) {
        this.leadForm = this.fb.group({
            title: ['', Validators.required],
            subjects: ['', Validators.required],
            classLevel: ['', Validators.required],
            mode: ['ONLINE', Validators.required],
            location: [''],
            budgetRange: [''],
            description: ['']
        });
    }

    onSubmit() {
        if (this.leadForm.invalid) {
            alert('Please fill all required fields correctly.');
            this.leadForm.markAllAsTouched(); // Show validation errors if any UI exists
            return;
        }

        // Convert comma subjects to array
        const formVal = this.leadForm.value;
        const subjectsArray = formVal.subjects.split(',').map((s: string) => s.trim());
        if (subjectsArray.length === 0 || subjectsArray[0] === '') {
            alert('Please enter at least one subject.');
            return;
        }

        const payload = { ...formVal, subjects: subjectsArray };

        this.leadService.createLead(payload).subscribe({
            next: () => {
                alert('Success! Tuition requirement posted.');
                this.router.navigate(['/parent/my-leads']);
            },
            error: (err) => {
                console.error('Lead creation error:', err);
                const msg = err.error?.message || 'Failed to create lead. Please try again.';
                alert(msg);
            }
        });
    }
}
