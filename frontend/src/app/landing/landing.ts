import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../core/api.config';
import { forkJoin } from 'rxjs';

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

  constructor(private authService: AuthService, private http: HttpClient,private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userRole = user?.role ?? null;
      // Name is now included in the JWT payload
      this.userName = user?.name ?? '';
    });
    this.fetchPublicData();

  }


fetchPublicData() {
  forkJoin({
    stats: this.http.get<any>(`${API_CONFIG.baseUrl}/public/stats`),
    leads: this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/leads`),
    tutors: this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/tutors`)
  }).subscribe({
    next: ({ stats, leads, tutors }) => {
      this.stats = stats;
      this.leads = leads ?? [];
      this.tutors = (tutors ?? []).slice(0, 3);
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Public data fetch failed", err);
    }
  });
}

  get dashboardLink(): string {
    return this.userRole ? '/dashboard' : '/login';
  }

  setActiveTab(tab: 'PARENT' | 'TUTOR') {
    this.activeTab = tab;
  }
}
