import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EcoLeafIcon } from '../eco-leaf-icon/eco-leaf-icon';
import { EcoPaladinButton } from '../eco-paladin-button/eco-paladin-button';
import { catchError, of } from 'rxjs';
import { AuditSolicitationService } from '../../services/audit-solicitation.service';

interface CompanyResponse {
  id: number;
  name: string;
  industry: string;
  verified: boolean;
  website: string;
  description: string;
  city: string;
  state: string;
  country: string;
  overallScore: number;
  scoreLabel: string;
  carbonScore: number;
  waterScore: number;
  energyScore: number;
  wasteScore: number;
  employees: number;
  employeesGrowthPct: number;
  esgAllocationPct: number;
  esgAllocationGrowthPct: number;
  greenProjects: number;
  greenProjectsGrowth: number;
}

interface CategoryScore {
  label: string;
  score: number;
}

interface StatCard {
  label: string;
  value: string;
  trend: string;
}

@Component({
  selector: 'app-companyhome',
  standalone: true,
  imports: [CommonModule, EcoLeafIcon, EcoPaladinButton],
  templateUrl: './companyhome.html',
  styleUrl: './companyhome.css',
})
export class Companyhome {
  private readonly companyId = 2;
  private readonly companyUrl = `http://localhost:8001/api/companies/${this.companyId}`;

  readonly isLoading = signal(true);

  readonly company = signal<Pick<CompanyResponse, 'name' | 'industry' | 'verified' | 'website' | 'description' | 'city' | 'state' | 'country'>>({
    name: '',
    industry: '',
    verified: false,
    website: '',
    description: '',
    city: '',
    state: '',
    country: '',
  });

  readonly scores = signal<{ overall: number; label: string }>({
    overall: 0,
    label: 'N/A',
  });

  readonly categories = signal<CategoryScore[]>([
    { label: 'Carbon', score: 0 },
    { label: 'Water', score: 0 },
    { label: 'Energy', score: 0 },
    { label: 'Waste', score: 0 },
  ]);

  readonly stats = signal<StatCard[]>([
    { label: 'Employees', value: '0', trend: '+0%' },
    { label: 'ESG Allocation', value: '0%', trend: '+0%' },
    { label: 'Green Projects', value: '0', trend: '+0' },
  ]);

  initiatives = [
    { title: 'Carbon Neutral Operations', desc: 'Achieved through renewable energy credits', status: 'Active' },
    { title: 'ESG Investment Portfolio', desc: '45% of AUM in ESG-compliant vehicles', status: 'Active' },
    { title: 'LEED Gold Headquarters', desc: 'Certified green building in Manhattan', status: 'Certified' },
  ];

  certifications = [
    'PRI Signatory',
    'CDP Climate Disclosure',
    'TCFD Reporting',
    'UN Global Compact',
    'SASB Aligned',
  ];

  readonly radius = 78;
  readonly circumference = 2 * Math.PI * this.radius;

  readonly location = computed(() => {
    const company = this.company();
    return [company.city, company.state, company.country].filter(Boolean).join(', ');
  });

  readonly overallDashArray = computed(() => {
    const progress = this.scores().overall / 100;
    return `${this.circumference * progress} ${this.circumference * (1 - progress)}`;
  });

  constructor(
    private readonly http: HttpClient,
    private readonly auditSolicitationService: AuditSolicitationService
  ) {
    this.loadCompany();
    this.loadAuditSolicitationStatus();
  }

  private loadCompany(): void {
    this.http
      .get<CompanyResponse>(this.companyUrl)
      .pipe(
        catchError((error) => {
          console.error('Failed to load company', error);
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.company.set({
          name: res.name,
          industry: res.industry,
          verified: res.verified,
          website: res.website,
          description: res.description,
          city: res.city,
          state: res.state,
          country: res.country,
        });

        this.scores.set({
          overall: res.overallScore,
          label: res.scoreLabel,
        });

        this.categories.set([
          { label: 'Carbon', score: res.carbonScore },
          { label: 'Water', score: res.waterScore },
          { label: 'Energy', score: res.energyScore },
          { label: 'Waste', score: res.wasteScore },
        ]);

        this.stats.set([
          {
            label: 'Employees',
            value: `${res.employees}`,
            trend: `${res.employeesGrowthPct >= 0 ? '+' : ''}${res.employeesGrowthPct.toFixed(2)}%`,
          },
          {
            label: 'ESG Allocation',
            value: `${res.esgAllocationPct.toFixed(2)}%`,
            trend: `${res.esgAllocationGrowthPct >= 0 ? '+' : ''}${res.esgAllocationGrowthPct.toFixed(2)}%`,
          },
          {
            label: 'Green Projects',
            value: `${res.greenProjects}`,
            trend: `${res.greenProjectsGrowth >= 0 ? '+' : ''}${res.greenProjectsGrowth}`,
          },
        ]);

        this.isLoading.set(false);
      });
  }

  private loadAuditSolicitationStatus(): void {
    this.auditSolicitationService.loadLatestStatus(this.companyId).subscribe();
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-lime-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  }

}
