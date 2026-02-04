import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';

declare var Razorpay: any; // Or use window.Razorpay if types not avail

@Component({
    selector: 'app-buy-points',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './buy-points.component.html',
    styleUrls: ['./buy-points.component.css']
})
export class BuyPointsComponent implements OnInit {
    plans: any[] = [];
    couponCode: string = '';
    discountMessage: string = '';
    loading = false;
    currentPoints = 0;

    constructor(
        private paymentService: PaymentService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.fetchPlans();
        // Fetch fresh profile to get accurate points
        this.authService.getProfile().subscribe({
            next: (user) => {
                this.currentPoints = user.points || 0;
            },
            error: () => this.currentPoints = 0
        });
    }

    fetchPlans(): void {
        this.paymentService.getPlans().subscribe({
            next: (data) => this.plans = data,
            error: (err) => console.error(err)
        });
    }

    validateCoupon(): void {
        if (!this.couponCode) return;
        this.paymentService.validateCoupon(this.couponCode).subscribe({
            next: (res) => {
                this.discountMessage = `Coupon applied! ${res.discountPercentage}% off`;
            },
            error: (err) => {
                this.discountMessage = 'Invalid or expired coupon';
                this.couponCode = '';
            }
        });
    }

    buyPlan(plan: any): void {
        this.loading = true;
        this.paymentService.createOrder(plan._id, this.couponCode).subscribe({
            next: (order) => {
                this.initiateRazorpay(order);
            },
            error: (err) => {
                console.error('Order creation failed', err);
                this.loading = false;
                alert('Failed to initiate purchase');
            }
        });
    }

    initiateRazorpay(order: any): void {
        const user = this.authService.getUserFromToken();
        const options = {
            key: 'rzp_test_placeholder', // Should be from env
            amount: order.amount * 100, // paise if not already
            currency: 'INR',
            name: 'ApnaTution',
            description: 'Buy Points',
            order_id: order.paymentId, // The TransactionID or specific Razorpay Order ID if strictly typed
            handler: (response: any) => {
                this.verifyPayment({
                    transactionId: order.transactionId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
            },
            prefill: {
                name: user?.name,
                email: user?.email
            },
            theme: { color: '#3399cc' }
        };

        // MOCKING RAZORPAY if not loaded
        if (typeof Razorpay === 'undefined') {
            console.warn("Razorpay SDK not loaded. Simulating success.");
            if (confirm("Simulate Payment Success?")) {
                this.verifyPayment({ transactionId: order.transactionId });
            } else {
                this.loading = false;
            }
            return;
        }

        const rzp = new Razorpay(options);
        rzp.open();
    }

    verifyPayment(data: any): void {
        this.paymentService.verifyPayment(data).subscribe({
            next: (res) => {
                alert('Payment Successful! Points added.');
                this.loading = false;
                this.router.navigate(['/tutor/leads']); // Redirect to leads to use points
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                alert('Payment Verification Failed');
            }
        });
    }
}
