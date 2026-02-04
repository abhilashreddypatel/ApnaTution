import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    userRole: string | null = null;
    userName: string = '';
    stats: any = null;
    loading = true;

    constructor(
        private authService: AuthService,
        private dashboardService: DashboardService,
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            console.log('DashboardComponent: User state changed', user);
            if (user) {
                this.userRole = user.role;
                this.userName = user.name || 'User';
                this.loadDashboardData();
            } else {
                console.log('DashboardComponent: No user found in stream');
            }
        });
    }

    loadDashboardData() {
        console.log('DashboardComponent: Loading data for role', this.userRole);
        this.loading = true;

        const handleResponse = (data: any) => {
            console.log('DashboardComponent: Data received', data);
            this.stats = data;
            this.loading = false;
            this.cdr.detectChanges();
        };

        const handleError = (err: any) => {
            console.error('DashboardComponent: Error loading data', err);
            this.loading = false;
            this.cdr.detectChanges();
        };

        if (this.userRole === 'PARENT') {
            this.dashboardService.getParentStats().subscribe({
                next: handleResponse,
                error: handleError
            });
        } else if (this.userRole === 'TUTOR') {
            this.dashboardService.getTutorStats().subscribe({
                next: handleResponse,
                error: handleError
            });
        } else if (this.userRole === 'ADMIN') {
            this.adminService.getStats().subscribe({
                next: handleResponse,
                error: handleError
            });
        }
    }

    logout() {
        this.authService.logout();
    }
}
