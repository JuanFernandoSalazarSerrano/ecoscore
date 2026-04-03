import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { TemperatureFetching } from '../../../services/temperature-fetching';

type DeploymentStatus = 'Passed' | 'Warning' | 'Failed';

interface DeploymentRow {
  id: string;
  module: string;
  environment: string;
  version: string;
  deployedAt: string;
  status: DeploymentStatus;
  ecoScore: number;
  temperatureC: number | null;
  humidity: number | null;
  carbonDelta: string;
  owner: string;
  notes: string;
}

@Component({
  selector: 'app-eco-paladin-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eco-paladin-results.html',
  styleUrl: './eco-paladin-results.css',
})
export class EcoPaladinResults implements OnInit {
  readonly title = 'paladin deployment results';

  readonly reportInfo = {
    organization: 'Mackensy Hedge Fund',
    reportId: 'PDR-2026-03-19-A',
    generatedBy: 'ecoPaladin Audit Engine',
    generatedOn: '2026-03-19 10:24 UTC',
    period: 'Q1 2026',
  };

  readonly rows = signal<DeploymentRow[]>([
    {
      id: 'DEP-001',
      module: 'Core API Gateway',
      environment: 'Production',
      version: 'v4.12.0',
      deployedAt: '2026-03-17 08:40',
      status: 'Passed',
      ecoScore: 88,
      temperatureC: null,
      humidity: null,
      carbonDelta: '-6.2%',
      owner: 'Platform Team',
      notes: 'Latency reduced after cache path optimization.',
    },
    {
      id: 'DEP-002',
      module: 'ESG Portfolio Service',
      environment: 'Production',
      version: 'v3.8.2',
      deployedAt: '2026-03-17 09:10',
      status: 'Passed',
      ecoScore: 84,
      temperatureC: null,
      humidity: null,
      carbonDelta: '-4.1%',
      owner: 'Quant Engineering',
      notes: 'CPU profile improved using batch reconciliation.',
    },
    {
      id: 'DEP-003',
      module: 'Risk Simulation Worker',
      environment: 'Staging',
      version: 'v2.5.9',
      deployedAt: '2026-03-18 14:05',
      status: 'Warning',
      ecoScore: 63,
      temperatureC: null,
      humidity: null,
      carbonDelta: '+1.8%',
      owner: 'Risk Analytics',
      notes: 'Memory spikes detected under 95th percentile load.',
    },
    {
      id: 'DEP-004',
      module: 'Sustainability Dashboard UI',
      environment: 'Production',
      version: 'v1.19.4',
      deployedAt: '2026-03-18 16:22',
      status: 'Passed',
      ecoScore: 79,
      temperatureC: null,
      humidity: null,
      carbonDelta: '-2.7%',
      owner: 'Product Engineering',
      notes: 'Bundle size reduced via deferred loading.',
    },
    {
      id: 'DEP-005',
      module: 'Data Export Pipeline',
      environment: 'Production',
      version: 'v5.3.1',
      deployedAt: '2026-03-19 06:30',
      status: 'Failed',
      ecoScore: 38,
      temperatureC: null,
      humidity: null,
      carbonDelta: '+7.4%',
      owner: 'Data Platform',
      notes: 'Job retries increased power usage; rollback pending.',
    },
    {
      id: 'DEP-006',
      module: 'Temperature - Sala de Profesores',
      environment: 'Facilities',
      version: '-',
      deployedAt: '2026-03-19 09:00',
      status: 'Passed',
      ecoScore: 92,
      temperatureC: 22.5,
      humidity: null,
      carbonDelta: '-0.2%',
      owner: 'Facilities Team',
      notes: 'Impacts HVAC energy use and emissions.',
    },
    {
      id: 'DEP-007',
      module: 'Humidity - Sala de Profesores',
      environment: 'Facilities',
      version: '-',
      deployedAt: '2026-03-19 09:00',
      status: 'Passed',
      ecoScore: 90,
      temperatureC: null,
      humidity: 0,
      carbonDelta: '-0.1%',
      owner: 'Facilities Team',
      notes: 'Humidity affects thermal comfort and HVAC efficiency.',
    },
  ]);

  constructor(private readonly tempService: TemperatureFetching) {}

  ngOnInit(): void {
    // fetch average temperature and populate Sala de Profesores row
    this.tempService.getAverageC().subscribe((avg) => {
      if (avg === null) return;

      const rounded = Number(avg.toFixed(1));
      this.rows.update((current) =>
        current.map((row) =>
          row.module?.toLowerCase().includes('sala de profesores')
            ? { ...row, temperatureC: rounded }
            : row
        )
      );
    });

    // fetch average humidity and populate Sala de Profesores humidity row
    this.tempService.getAverageHumidity().subscribe((avgHumidity) => {
      if (avgHumidity === null) return;

      const roundedHumidity = Number(avgHumidity.toFixed(1));
      this.rows.update((current) =>
        current.map((row) =>
          row.module?.toLowerCase().includes('humidity - sala de profesores')
            ? { ...row, humidity: roundedHumidity }
            : row
        )
      );
    });
  }

  readonly passedCount = computed(() => this.rows().filter((r) => r.status === 'Passed').length);

  readonly warningCount = computed(() => this.rows().filter((r) => r.status === 'Warning').length);

  readonly failedCount = computed(() => this.rows().filter((r) => r.status === 'Failed').length);

  readonly averageScore = computed(() => {
    const rows = this.rows();
    if (rows.length === 0) return 0;
    const total = rows.reduce((sum, r) => sum + r.ecoScore, 0);
    return Math.round(total / rows.length);
  });

  getScoreClass(score: number): string {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-lime-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  }

  getStatusClass(status: DeploymentStatus): string {
    if (status === 'Passed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Warning') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  }

}
