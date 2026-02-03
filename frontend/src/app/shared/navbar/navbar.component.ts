import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-light);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      cursor: pointer;
    }
    .links a {
      color: var(--text-secondary);
      text-decoration: none;
      margin-left: 20px;
      font-weight: 500;
      transition: color 0.3s;
    }
    .links a:hover, .links a.active {
      color: var(--primary);
    }
    button {
      margin-left: 20px;
      padding: 0.5rem 1rem;
      background: rgba(236, 72, 153, 0.2);
      color: var(--secondary);
      border: 1px solid var(--secondary);
      cursor: pointer;
      border-radius: var(--radius-sm);
      font-weight: 600;
      transition: all 0.3s;
    }
    button:hover {
      background: var(--secondary);
      color: white;
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
    }
    .btn-register {
      background: var(--primary);
      color: white !important;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      transition: all 0.3s;
    }
    .btn-register:hover {
      box-shadow: 0 0 15px var(--primary-glow);
    }
  `]
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;
  role$: Observable<string | null>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.user$.pipe(map(user => !!user));
    this.role$ = this.authService.user$.pipe(map(user => user ? user.role : null));
  }

  logout() {
    this.authService.logout();
  }
}
