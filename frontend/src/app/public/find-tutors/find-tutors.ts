import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { API_CONFIG } from '../../core/api.config';

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
    private router: Router,
    private cdr: ChangeDetectorRef
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
    console.log('FindTutors: Loading tutors...');
    this.loading = true;
    this.http.get<any[]>(`${API_CONFIG.baseUrl}/public/tutors`).subscribe({
      next: (data) => {
        console.log('FindTutors: Tutors data received', data);
        this.tutors = data;
        this.filteredTutors = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('FindTutors: Error fetching tutors:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Filter State
  filters = {
    location: '',
    subject: '',
    class: '',
    mode: ''
  };

  onFilterChange(field: string, event: any) {
    const value = event.target.value.toLowerCase();
    this.filters[field as keyof typeof this.filters] = value;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTutors = this.tutors.filter(tutor => {
      // 1. Location Filter (Pincode or Name)
      const locationMatch = !this.filters.location ||
        (tutor.location && tutor.location.toLowerCase().includes(this.filters.location));

      // 2. Subject Filter
      const subjectMatch = !this.filters.subject ||
        (tutor.subjects && tutor.subjects.some((s: string) => s.toLowerCase().includes(this.filters.subject)));

      // 3. Class/Grade Filter (Checks if any subject or description mentions class)
      // Since we don't have a specific 'class' field in User model shown yet, 
      // we'll check subjects or a theoretical 'classesTaught' or just generic string match.
      // For now, let's assume it might be in 'subjects' tags like 'Class 10' or 'CBSE'.
      const classMatch = !this.filters.class ||
        (tutor.subjects && tutor.subjects.some((s: string) => s.toLowerCase().includes(this.filters.class))) ||
        (tutor.tagline && tutor.tagline.toLowerCase().includes(this.filters.class));

      // 4. Mode Filter
      const modeMatch = !this.filters.mode ||
        (tutor.mode && tutor.mode.toLowerCase() === this.filters.mode);

      return locationMatch && subjectMatch && classMatch && modeMatch;
    });

    // Trigger UI update
    this.cdr.detectChanges();
  }
}
