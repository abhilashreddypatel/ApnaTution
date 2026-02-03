import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://localhost:5000/payments';

    constructor(private http: HttpClient) { }

    createOrder(leadId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-order`, { leadId });
    }

    verifyPayment(paymentData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify`, paymentData);
    }
}
