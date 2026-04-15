import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../core/api.config';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  userRole: string | null = null;
  userName: string = '';
  stats = { tutors: 0, students: 0, activeLeads: 0 };
  leads: any[] = [];
  tutors: any[] = [];
  activeTab: 'PARENT' | 'TUTOR' = 'PARENT';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userRole = user?.role ?? null;
      // Name is now included in the JWT payload
      this.userName = user?.name ?? '';
    });
    this.fetchPublicData();
  }

  fetchPublicData() {
    this.http.get<any>(`${API_CONFIG.baseUrl}/public/stats`).subscribe({
      next: (data) => this.stats = data,
      error: () => {}
    });

    this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/leads`).subscribe({
      next: (data) => this.leads = data,
      error: () => {}
    });

    this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/tutors`).subscribe({
      next: (data) => this.tutors = data.slice(0, 3),
      error: () => {}
    });
  }

  get dashboardLink(): string {
    return this.userRole ? '/dashboard' : '/login';
  }

  setActiveTab(tab: 'PARENT' | 'TUTOR') {
    this.activeTab = tab;
  }
}
