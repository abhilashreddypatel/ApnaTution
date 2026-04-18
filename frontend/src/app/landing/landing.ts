import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../core/api.config';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  userRole: string | null = null;
  userName: string = '';
  activeTab: 'PARENT' | 'TUTOR' = 'PARENT';

  stats = { tutors: 0, students: 0, activeLeads: 0 };
  leads:  any[] = [];
  tutors: any[] = [];

  searchCity    = '';
  searchSubject = '';

  readonly popularSubjects = [
    { name: 'Mathematics',    icon: 'fa-square-root-variable', color: '#4f46e5' },
    { name: 'Physics',        icon: 'fa-atom',                 color: '#0891b2' },
    { name: 'Chemistry',      icon: 'fa-flask',                color: '#16a34a' },
    { name: 'Biology',        icon: 'fa-leaf',                 color: '#15803d' },
    { name: 'English',        icon: 'fa-book-open',            color: '#7c3aed' },
    { name: 'Hindi',          icon: 'fa-language',             color: '#dc2626' },
    { name: 'JEE Prep',       icon: 'fa-rocket',               color: '#ea580c' },
    { name: 'NEET Prep',      icon: 'fa-stethoscope',          color: '#059669' },
    { name: 'Computer Sci.',  icon: 'fa-laptop-code',          color: '#2563eb' },
    { name: 'Social Studies', icon: 'fa-globe-asia',           color: '#d97706' },
    { name: 'Accountancy',    icon: 'fa-calculator',           color: '#9333ea' },
    { name: 'Music',          icon: 'fa-music',                color: '#e11d48' },
  ];

  readonly topCities = [
    { name: 'Delhi',       icon: 'fa-monument' },
    { name: 'Mumbai',      icon: 'fa-city' },
    { name: 'Bangalore',   icon: 'fa-building' },
    { name: 'Hyderabad',   icon: 'fa-mosque' },
    { name: 'Chennai',     icon: 'fa-umbrella-beach' },
    { name: 'Pune',        icon: 'fa-mountain-sun' },
    { name: 'Kolkata',     icon: 'fa-archway' },
    { name: 'Jaipur',      icon: 'fa-fort-awesome' },
  ];

  readonly testimonials = [
    {
      name:    'Priya Sharma',
      role:    'Parent, Delhi',
      avatar:  'PS',
      rating:  5,
      text:    'Found an amazing Math tutor for my Class 10 daughter within 2 days. The platform is so easy to use — no middlemen, direct contact!',
    },
    {
      name:    'Rohit Verma',
      role:    'Tutor, Mumbai',
      avatar:  'RV',
      rating:  5,
      text:    'I\'ve been using ApnaTutors for 6 months now. It\'s by far the best platform to find genuine students. Worth every point I spend!',
    },
    {
      name:    'Ananya Singh',
      role:    'Parent, Bangalore',
      avatar:  'AS',
      rating:  5,
      text:    'My son needed a NEET tutor urgently. Got 3 calls within 24 hours! The quality of tutors on this platform is outstanding.',
    },
  ];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userRole = user?.role ?? null;
      this.userName = user?.name ?? '';
    });
    this.fetchPublicData();
  }

  fetchPublicData() {
    forkJoin({
      stats:  this.http.get<any>(`${API_CONFIG.baseUrl}/public/stats`),
      leads:  this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/leads`),
      tutors: this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/tutors`),
    }).subscribe({
      next: ({ stats, leads, tutors }) => {
        this.stats  = stats;
        this.leads  = (leads  ?? []).slice(0, 6);
        this.tutors = (tutors ?? []).slice(0, 3);
        this.cdr.detectChanges();
      },
      error: err => console.error('Public data fetch failed', err),
    });
  }

  get dashboardLink(): string {
    return this.userRole ? '/dashboard' : '/login';
  }

  setActiveTab(tab: 'PARENT' | 'TUTOR') {
    this.activeTab = tab;
  }

  onSearch() {
    this.router.navigate(['/find-tutors'], {
      queryParams: {
        city:    this.searchCity    || undefined,
        subject: this.searchSubject || undefined,
      },
    });
  }

  searchBySubject(subject: string) {
    this.router.navigate(['/find-tutors'], { queryParams: { subject } });
  }

  searchByCity(city: string) {
    this.router.navigate(['/find-tutors'], { queryParams: { city } });
  }
}
