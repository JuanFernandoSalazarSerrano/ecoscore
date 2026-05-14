// paladinappointments.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface AuditSolicitationResponse {
  id: number;
  facilityName: string | null;
  facilityType: string | null;
  streetAddress: string | null;
  city: string | null;
  country: string | null;
  preferredStartDate: string | null;
  preferredTimeSlot: string | null;
  auditTypes: string | null;
  solved: boolean | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  accessRestrictions: string | null;
  specialInstructions: string | null;
  createdAt: string | null;
}

interface Appointment {
  id: string;
  facilityName: string;
  facilityType: string;
  address: string;
  city: string;
  country: string;
  date: string;
  time: string;
  auditTypes: string[];
  status: 'scheduled' | 'completed';
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  estimatedDuration: string;
  notes?: string;
  ecoScore?: number;
}

@Component({
  selector: 'app-paladinappointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paladinappointments.html',
})
export class Paladinappointments implements OnInit {
  private readonly auditSolicitationUrl = 'http://127.0.0.1:8080/api/audit-solicitations';

  selectedFilter: string = 'all';
  selectedAppointment: Appointment | null = null;
  isLoading = true;
  loadError = '';
  scheduledCount = 0;
  completedCount = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  trackByAppointmentId(index: number, appointment: Appointment): string {
    return appointment.id;
  }

  filters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'scheduled', label: 'Scheduled', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
  ];

  appointments: Appointment[] = [];

  private loadAppointments(): void {
    this.isLoading = true;
    this.loadError = '';
    this.http
      .get<AuditSolicitationResponse[]>(this.auditSolicitationUrl)
      .pipe(
        catchError((error) => {
          console.error('Failed to load audit solicitations', error);
          this.loadError = 'Unable to load appointments right now.';
          this.isLoading = false;
          return of([] as AuditSolicitationResponse[]);
        })
      )
      .subscribe((items) => {
        this.appointments = items.map((item) => this.mapAppointment(item));
        this.updateFilterCounts();
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private mapAppointment(item: AuditSolicitationResponse): Appointment {
    const auditTypes = this.parseAuditTypes(item.auditTypes);
    const status: 'scheduled' | 'completed' = item.solved ? 'completed' : 'scheduled';
    const date = item.preferredStartDate || item.createdAt || '';
    const time = item.preferredTimeSlot || 'TBD';
    const notes = item.specialInstructions || item.accessRestrictions || undefined;
    return {
      id: `${item.id}`,
      facilityName: item.facilityName || 'Unknown Facility',
      facilityType: item.facilityType || 'Other',
      address: item.streetAddress || 'TBD',
      city: item.city || 'TBD',
      country: item.country || 'TBD',
      date,
      time,
      auditTypes,
      status,
      contactName: item.contactName || 'TBD',
      contactPhone: item.contactPhone || 'TBD',
      contactEmail: item.contactEmail || 'TBD',
      estimatedDuration: this.resolveDuration(item.preferredTimeSlot),
      notes,
    };
  }

  private parseAuditTypes(value: string | null): string[] {
    if (!value) {
      return [];
    }
    const trimmed = value.trim();
    const cleaned = trimmed.replace(/^\[|\]$/g, '');
    return cleaned
      .split(',')
      .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }

  private resolveDuration(timeSlot: string | null): string {
    if (!timeSlot) {
      return 'TBD';
    }
    const normalized = timeSlot.toLowerCase();
    if (normalized.includes('full day')) {
      return 'Full Day';
    }
    if (normalized.includes('morning') || normalized.includes('afternoon')) {
      return 'Half Day';
    }
    return timeSlot;
  }

  private updateFilterCounts(): void {
    this.scheduledCount = this.appointments.filter((apt) => apt.status === 'scheduled').length;
    this.completedCount = this.appointments.filter((apt) => apt.status === 'completed').length;
    this.filters = [
      { id: 'all', label: 'All', count: this.appointments.length },
      { id: 'scheduled', label: 'Scheduled', count: this.scheduledCount },
      { id: 'completed', label: 'Completed', count: this.completedCount },
    ];
  }

  get filteredAppointments(): Appointment[] {
    if (this.selectedFilter === 'all') {
      return this.appointments;
    }
    return this.appointments.filter(apt => apt.status === this.selectedFilter);
  }

  getStatusConfig(status: string): { label: string; bgClass: string; textClass: string; dotClass: string } {
    const configs: Record<string, { label: string; bgClass: string; textClass: string; dotClass: string }> = {
      'scheduled': {
        label: 'Scheduled',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-700',
        dotClass: 'bg-blue-500'
      },
      'completed': {
        label: 'Completed',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        dotClass: 'bg-emerald-500'
      },
    };
    return configs[status] || configs['scheduled'];
  }

  getAuditTypeConfig(type: string): { label: string; icon: string; color: string } {
    const configs: Record<string, { label: string; icon: string; color: string }> = {
      'carbon': { label: 'Carbon', icon: '🌿', color: 'text-emerald-600' },
      'water': { label: 'Water', icon: '💧', color: 'text-blue-500' },
      'energy': { label: 'Energy', icon: '⚡', color: 'text-amber-500' },
      'waste': { label: 'Waste', icon: '♻️', color: 'text-teal-600' },
    };
    return configs[type] || { label: type, icon: '📋', color: 'text-gray-600' };
  }

  getFacilityIcon(type: string): string {
    const icons: Record<string, string> = {
      'Education': '🎓',
      'Healthcare': '🏥',
      'Manufacturing': '🏭',
      'Office Building': '🏢',
      'Retail': '🛍️',
      'Warehouse': '📦',
      'Data Center': '🖥️',
      'Other': '🏗️',
    };
    return icons[type] || '🏢';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) {
      return 'TBD';
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  }

  getScoreRingColor(score: number): string {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    return 'stroke-rose-500';
  }

  openDetails(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  closeDetails(): void {
    this.selectedAppointment = null;
  }
}
