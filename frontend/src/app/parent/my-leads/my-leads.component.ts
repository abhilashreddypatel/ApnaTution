import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeadService } from '../../core/services/lead.service';

@Component({
    selector: 'app-my-leads',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './my-leads.component.html',
    styleUrl: './my-leads.component.css'
})
export class MyLeadsComponent implements OnInit {
    leads: any[] = [];
    loading = true;

    constructor(private leadService: LeadService,private cdr:ChangeDetectorRef) {}

    ngOnInit() {
        this.leadService.getMyLeads().subscribe({
            next: (data) => {
                this.leads = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
            }
        });
    }
}
