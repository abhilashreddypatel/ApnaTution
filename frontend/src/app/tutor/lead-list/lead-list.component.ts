import { Component, OnInit } from '@angular/core';
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
    leads: any[] = [];

    constructor(
        private leadService: LeadService,
        private paymentService: PaymentService
    ) { }

    ngOnInit() {
        this.loadLeads();
    }

    loadLeads() {
        this.leadService.getLeadsForTutor().subscribe(data => {
            this.leads = data;
        });
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
