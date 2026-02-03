import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

    constructor(
        private leadService: LeadService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        console.log('MyLeadsComponent: Loading leads...');
        this.leadService.getMyLeads().subscribe({
            next: (data) => {
                console.log('MyLeadsComponent: Leads received', data);
                this.leads = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('MyLeadsComponent: Error loading leads', err);
            }
        });
    }
}
