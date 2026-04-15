import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';

declare var Razorpay: any;

@Component({
    selector: 'app-buy-points',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './buy-points.component.html',
    styleUrls: ['./buy-points.component.css']
})
export class BuyPointsComponent implements OnInit {
    plans: any[] = [];
    couponCode = '';
    discountMessage = '';
    loading = false;
    currentPoints = 0;

    constructor(
        private paymentService: PaymentService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.paymentService.getPlans().subscribe({
            next: (data) => this.plans = data,
            error: () => {}
        });
        this.authService.getProfile().subscribe({
            next: (user) => this.currentPoints = user.points || 0,
            error: () => {}
        });
    }

    validateCoupon(): void {
        if (!this.couponCode.trim()) return;
        this.paymentService.validateCoupon(this.couponCode).subscribe({
            next: (res) => {
                this.discountMessage = `Coupon applied! ${res.discountPercentage}% discount`;
            },
            error: (err) => {
                this.discountMessage = err.error?.message || 'Invalid or expired coupon';
                this.couponCode = '';
            }
        });
    }

    buyPlan(plan: any): void {
        this.loading = true;
        this.paymentService.createOrder(plan._id, this.couponCode || undefined).subscribe({
            next: (order) => this.initiateRazorpay(order),
            error: () => {
                this.loading = false;
            }
        });
    }

    initiateRazorpay(order: any): void {
        const user = this.authService.getUserFromToken();

        // If Razorpay SDK isn't loaded (dev/testing), simulate payment
        if (typeof Razorpay === 'undefined') {
            if (confirm(`[DEV] Simulate payment of ₹${order.amount} for ${order.points} points?`)) {
                this.verifyPayment({ transactionId: order.transactionId });
            } else {
                this.loading = false;
            }
            return;
        }

        const options = {
            key: 'rzp_test_placeholder', // Replace with real Razorpay key from env
            amount: order.amount * 100,
            currency: order.currency || 'INR',
            name: 'ApnaTution',
            description: `${order.planName} — ${order.points} Points`,
            order_id: order.paymentId,
            handler: (response: any) => {
                this.verifyPayment({
                    transactionId: order.transactionId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
            },
            prefill: { name: user?.name, email: user?.email },
            theme: { color: '#2563eb' },
            modal: {
                ondismiss: () => { this.loading = false; }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    verifyPayment(data: any): void {
        this.paymentService.verifyPayment(data).subscribe({
            next: (res) => {
                this.currentPoints = res.points;
                this.loading = false;
                this.router.navigate(['/tutor/leads']);
            },
            error: () => {
                this.loading = false;
            }
        });
    }
}
