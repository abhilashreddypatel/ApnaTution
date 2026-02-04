import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://localhost:5000/payments';

    constructor(private http: HttpClient) { }

    getPlans(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/plans`);
    }

    validateCoupon(code: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/validate-coupon`, { code });
    }

    createOrder(planId: string, couponCode?: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-order`, { planId, couponCode });
    }

    verifyPayment(paymentData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify`, paymentData);
    }
}
