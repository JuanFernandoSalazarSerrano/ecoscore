import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { testUsers } from '../data/companyinfo';
import { EcoLeafIcon } from './components/eco-leaf-icon/eco-leaf-icon';
import { EcoPaladinButton } from './components/eco-paladin-button/eco-paladin-button';
import { EcoPaladinResults } from './components/eco-paladin-results/eco-paladin-results';

const profile = testUsers[0];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EcoLeafIcon, EcoPaladinButton, EcoPaladinResults],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecoscore');
  company = profile.company;
  scores = profile.scores;
  categories = profile.categories;
  stats = profile.stats;

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

  get overallDashArray(): string {
    const progress = this.scores.overall / 100;
    return `${this.circumference * progress} ${this.circumference * (1 - progress)}`;
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-lime-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  }
}
