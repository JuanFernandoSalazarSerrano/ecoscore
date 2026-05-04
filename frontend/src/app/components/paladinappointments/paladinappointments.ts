// paladinappointments.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
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
export class Paladinappointments {
  selectedFilter: string = 'all';
  selectedAppointment: Appointment | null = null;

  trackByAppointmentId(index: number, appointment: Appointment): string {
  return appointment.id;
}

  filters = [
    { id: 'all', label: 'All', count: 8 },
    { id: 'scheduled', label: 'Scheduled', count: 4 },
    { id: 'in-progress', label: 'In Progress', count: 2 },
    { id: 'completed', label: 'Completed', count: 1 },
    { id: 'cancelled', label: 'Cancelled', count: 1 },
  ];

  appointments: Appointment[] = [
    {
      id: 'APT-001',
      facilityName: 'Universidad Autónoma de Occidente',
      facilityType: 'Education',
      address: 'Calle 25 # 115-85, Km 2 vía Cali-Jamundí',
      city: 'Cali, Valle del Cauca',
      country: 'Colombia',
      date: '2024-02-15',
      time: '09:00 AM',
      auditTypes: ['carbon', 'energy', 'water', 'waste'],
      status: 'scheduled',
      contactName: 'Dr. María González',
      contactPhone: '+57 2 318 8000',
      contactEmail: 'mgonzalez@uao.edu.co',
      estimatedDuration: 'Full Day (8 hours)',
      notes: 'Main campus audit. Security clearance required at entrance.',
    },
    {
      id: 'APT-002',
      facilityName: 'TechHub Innovation Center',
      facilityType: 'Office Building',
      address: '450 Silicon Avenue, Building C',
      city: 'San Francisco, CA',
      country: 'United States',
      date: '2024-02-14',
      time: '10:00 AM',
      auditTypes: ['carbon', 'energy'],
      status: 'in-progress',
      contactName: 'James Chen',
      contactPhone: '+1 (415) 555-0123',
      contactEmail: 'jchen@techhub.io',
      estimatedDuration: 'Half Day (4 hours)',
      ecoScore: 72,
    },
    {
      id: 'APT-003',
      facilityName: 'GreenLeaf Manufacturing',
      facilityType: 'Manufacturing',
      address: '2800 Industrial Park Road',
      city: 'Munich, Bavaria',
      country: 'Germany',
      date: '2024-02-16',
      time: '08:00 AM',
      auditTypes: ['carbon', 'waste', 'water'],
      status: 'scheduled',
      contactName: 'Hans Mueller',
      contactPhone: '+49 89 1234567',
      contactEmail: 'hmueller@greenleaf.de',
      estimatedDuration: 'Full Day (8 hours)',
      notes: 'PPE required. Bring safety boots and hard hat.',
    },
    {
      id: 'APT-004',
      facilityName: 'Central Hospital Complex',
      facilityType: 'Healthcare',
      address: '100 Medical Center Drive',
      city: 'Toronto, Ontario',
      country: 'Canada',
      date: '2024-02-12',
      time: '07:00 AM',
      auditTypes: ['energy', 'water', 'waste'],
      status: 'completed',
      contactName: 'Dr. Sarah Thompson',
      contactPhone: '+1 (416) 555-7890',
      contactEmail: 'sthompson@centralhospital.ca',
      estimatedDuration: 'Full Day (8 hours)',
      ecoScore: 85,
    },
    {
      id: 'APT-005',
      facilityName: 'EcoMart Distribution Center',
      facilityType: 'Warehouse',
      address: '5500 Logistics Boulevard',
      city: 'Rotterdam',
      country: 'Netherlands',
      date: '2024-02-17',
      time: '06:00 AM',
      auditTypes: ['carbon', 'energy'],
      status: 'scheduled',
      contactName: 'Erik van der Berg',
      contactPhone: '+31 10 123 4567',
      contactEmail: 'evandenberg@ecomart.nl',
      estimatedDuration: 'Half Day (4 hours)',
    },
    {
      id: 'APT-006',
      facilityName: 'Nordic Data Systems',
      facilityType: 'Data Center',
      address: '15 Arctic Circle Tech Park',
      city: 'Stockholm',
      country: 'Sweden',
      date: '2024-02-13',
      time: '09:00 AM',
      auditTypes: ['energy', 'carbon'],
      status: 'in-progress',
      contactName: 'Anna Lindqvist',
      contactPhone: '+46 8 123 456 78',
      contactEmail: 'alindqvist@nordicdata.se',
      estimatedDuration: 'Full Day (8 hours)',
      ecoScore: 68,
      notes: 'High security facility. Escort required at all times.',
    },
    {
      id: 'APT-007',
      facilityName: 'Fashion Forward Retail HQ',
      facilityType: 'Retail',
      address: '88 Champs-Élysées',
      city: 'Paris',
      country: 'France',
      date: '2024-02-18',
      time: '10:00 AM',
      auditTypes: ['carbon', 'waste'],
      status: 'scheduled',
      contactName: 'Sophie Dubois',
      contactPhone: '+33 1 23 45 67 89',
      contactEmail: 'sdubois@fashionforward.fr',
      estimatedDuration: 'Half Day (4 hours)',
    },
    {
      id: 'APT-008',
      facilityName: 'Sunrise Solar Farm',
      facilityType: 'Other',
      address: '1 Renewable Energy Way',
      city: 'Phoenix, AZ',
      country: 'United States',
      date: '2024-02-10',
      time: '08:00 AM',
      auditTypes: ['energy', 'carbon', 'water'],
      status: 'cancelled',
      contactName: 'Robert Martinez',
      contactPhone: '+1 (602) 555-4321',
      contactEmail: 'rmartinez@sunrisesolar.com',
      estimatedDuration: 'Full Day (8 hours)',
      notes: 'Cancelled due to equipment maintenance.',
    },
  ];

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
      'in-progress': {
        label: 'In Progress',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        dotClass: 'bg-amber-500'
      },
      'completed': {
        label: 'Completed',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        dotClass: 'bg-emerald-500'
      },
      'cancelled': {
        label: 'Cancelled',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-700',
        dotClass: 'bg-rose-500'
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
