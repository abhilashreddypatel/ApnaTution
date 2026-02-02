import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
        const expectedRole = route.data['role'];
        const userRole = this.authService.getRole();

        if (userRole === expectedRole) {
            return true;
        }

        // Redirect to appropriate dashboard if logged in but wrong role, or login
        if (userRole) {
            // Simple fallback
            return this.router.createUrlTree(['/']);
        }
        return this.router.createUrlTree(['/login']);
    }
}
