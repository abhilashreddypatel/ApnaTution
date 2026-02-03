import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:5000/admin';

    constructor(private http: HttpClient) { }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }

    closeLead(leadId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/leads/${leadId}/close`, {});
    }
}
