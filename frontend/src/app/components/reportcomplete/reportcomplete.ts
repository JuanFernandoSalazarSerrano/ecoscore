// report-ready.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reportcomplete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportcomplete.html',
  styleUrl: './reportcomplete.css',
})
export class Reportcomplete {

  @Input() reportName: string = 'EcoScore Assessment';
  @Input() facilityName: string = 'Your Facility';
  @Input() generatedDate: string = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

}
