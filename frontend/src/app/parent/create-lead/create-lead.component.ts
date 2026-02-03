import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../../core/services/lead.service';

@Component({
    selector: 'app-create-lead',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './create-lead.component.html',
    styleUrl: './create-lead.component.css'
})
export class CreateLeadComponent implements OnInit {
    leadForm: FormGroup;
    isEditMode = false;
    leadId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private leadService: LeadService,
        private router: Router,
        private route: ActivatedRoute
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

    ngOnInit() {
        this.leadId = this.route.snapshot.paramMap.get('id');
        if (this.leadId) {
            this.isEditMode = true;
            this.loadLeadData(this.leadId);
        }
    }

    loadLeadData(id: string) {
        this.loading = true;
        this.leadService.getLead(id).subscribe({
            next: (lead) => {
                // Convert array to comma-string for display
                const subjectsStr = lead.subjects ? lead.subjects.join(', ') : '';
                this.leadForm.patchValue({
                    ...lead,
                    subjects: subjectsStr
                });
                this.loading = false;
            },
            error: () => {
                alert('Failed to load lead details');
                this.loading = false;
                this.router.navigate(['/parent/my-leads']);
            }
        });
    }

    onSubmit() {
        if (this.leadForm.invalid) {
            alert('Please fill all required fields correctly.');
            this.leadForm.markAllAsTouched();
            return;
        }

        const formVal = this.leadForm.value;
        const subjectsArray = formVal.subjects.split(',').map((s: string) => s.trim());
        if (subjectsArray.length === 0 || subjectsArray[0] === '') {
            alert('Please enter at least one subject.');
            return;
        }

        const payload = { ...formVal, subjects: subjectsArray };

        if (this.isEditMode && this.leadId) {
            // Update
            this.leadService.updateLead(this.leadId, payload).subscribe({
                next: () => {
                    alert('Lead updated successfully.');
                    this.router.navigate(['/parent/my-leads']);
                },
                error: (err) => {
                    console.error('Update error:', err);
                    alert('Failed to update lead.');
                }
            });
        } else {
            // Create
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
}
