import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userRole = user ? user.role : null;
      this.userName = user ? user.name : '';
    });

    this.fetchPublicData();
  }

  fetchPublicData() {
    // Fetch Global Stats
    this.http.get<any>('http://localhost:5000/public/stats').subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Stats error:', err)
    });

    // Fetch Recent Leads (for Tutors and Guests)
    this.http.get<any[]>('http://localhost:5000/public/leads').subscribe({
      next: (data) => this.leads = data,
      error: (err) => console.error('Leads error:', err)
    });

    // Fetch Featured Tutors (for Parents)
    this.http.get<any[]>('http://localhost:5000/public/tutors').subscribe({
      next: (data) => this.tutors = data.slice(0, 3), // Just top 3
      error: (err) => console.error('Tutors error:', err)
    });
  }

  get dashboardLink(): string {
    return this.userRole ? '/dashboard' : '/login';
  }
}
