import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../core/services/lead.service';
import { PaymentService } from '../../core/services/payment.service';

// Razorpay type definition
declare var Razorpay: any;

@Component({
    selector: 'app-lead-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lead-list.component.html',
    styleUrl: './lead-list.component.css'
})
export class LeadListComponent implements OnInit {
    allLeads: any[] = [];
    filteredLeads: any[] = [];
    filters = {
        location: '',
        course: '',
        subject: '',
        price: ''
    };

    constructor(
        private leadService: LeadService,
        private paymentService: PaymentService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadLeads();
    }

    loadLeads() {
        console.log('LeadListComponent: Loading leads...');
        this.leadService.getLeadsForTutor().subscribe({
            next: (data) => {
                console.log('LeadListComponent: Leads received', data);
                this.allLeads = data;
                this.filteredLeads = [...data];
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('LeadListComponent: Error loading leads', error);
            }
        });
    }

    onFilterChange(field: string, event: any) {
        let value = event.target.value;
        if (field !== 'price') {
            value = value.toLowerCase();
        }
        this.filters[field as keyof typeof this.filters] = value;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredLeads = this.allLeads.filter(lead => {
            const locMatch = !this.filters.location || (lead.location && lead.location.toLowerCase().includes(this.filters.location));

            // Course/Class match
            const courseMatch = !this.filters.course ||
                (lead.classLevel && lead.classLevel.toLowerCase().includes(this.filters.course));

            const subMatch = !this.filters.subject ||
                (lead.subjects && lead.subjects.some((s: string) => s.toLowerCase().includes(this.filters.subject)));

            // Simple price logic (just checking if budget range contains relevant numbers or matches)
            // Real implementation would parse '500-1000'
            let priceMatch = true;
            if (this.filters.price) {
                // Determine logic based on radio value: '200', '500', '1000', '1000+'
                // This is a rough heuristic since budget is a string
                // We'll skip complex parsing for this demo unless requested, 
                // but let's assume if user picked '500', we look for '500' in the string.
                // A better backend query would be ideal.
                priceMatch = lead.budgetRange && lead.budgetRange.includes(this.filters.price);
            }

            return locMatch && courseMatch && subMatch && priceMatch;
        });
        this.cdr.detectChanges();
    }

    unlockLead(lead: any) {
        this.paymentService.createOrder(lead._id).subscribe({
            next: (order) => {
                this.openCheckout(order, lead._id);
            },
            error: () => alert('Failed to create order')
        });
    }

    openCheckout(order: any, leadId: string) {
        const options = {
            key: 'rzp_test_1234567890', // Replace with Env Var in real app
            amount: order.amount,
            currency: order.currency,
            name: 'ApnaTution',
            description: 'Unlock Lead',
            order_id: order.id,
            handler: (response: any) => {
                this.verifyPayment(response, leadId);
            },
            prefill: {
                name: 'Tutor',
                email: 'tutor@example.com'
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    verifyPayment(response: any, leadId: string) {
        const payload = {
            ...response,
            leadId
        };
        this.paymentService.verifyPayment(payload).subscribe({
            next: () => {
                alert('Payment Successful! Lead Unlocked.');
                this.loadLeads(); // Refresh to see unlocked state
            },
            error: () => alert('Payment Verification Failed')
        });
    }
}
