import { Component, OnInit } from '@angular/core';
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
        private adminService: AdminService
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userRole = user.role;
                this.userName = user.name || 'User';
                this.loadDashboardData();
            }
        });
    }

    loadDashboardData() {
        this.loading = true;

        const done = (data: any) => { this.stats = data; this.loading = false; };
        const fail = ()          => { this.loading = false; };

        if (this.userRole === 'PARENT') {
            this.dashboardService.getParentStats().subscribe({ next: done, error: fail });
        } else if (this.userRole === 'TUTOR') {
            this.dashboardService.getTutorStats().subscribe({ next: done, error: fail });
        } else if (this.userRole === 'ADMIN') {
            this.adminService.getStats().subscribe({ next: done, error: fail });
        }
    }

    logout() {
        this.authService.logout();
    }
}
