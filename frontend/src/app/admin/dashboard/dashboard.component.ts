import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    stats: any = null;

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.adminService.getStats().subscribe({
            next: (data) => { this.stats = data; this.cdr.detectChanges(); },
            error: (err) => console.error('Failed to load stats', err)
        });
    }
}
