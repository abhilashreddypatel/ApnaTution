import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-find-tutors',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './find-tutors.html',
  styleUrl: './find-tutors.css',
})
export class FindTutors implements OnInit {
  tutors: any[] = [];
  filteredTutors: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Restriction: Tutors shouldn't browse other tutors
    if (this.authService.getRole() === 'TUTOR') {
      this.router.navigate(['/tutor/leads']);
      return;
    }
    this.fetchTutors();
  }

  fetchTutors() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:5000/public/tutors').subscribe({
      next: (data) => {
        this.tutors = data;
        this.filteredTutors = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tutors:', err);
        this.loading = false;
      }
    });
  }

  // Placeholder for filter logic
  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredTutors = this.tutors.filter(t =>
      (t.subjects && t.subjects.some((s: string) => s.toLowerCase().includes(query))) ||
      (t.location && t.location.toLowerCase().includes(query)) ||
      (t.name && t.name.toLowerCase().includes(query))
    );
  }
}
