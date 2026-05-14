import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-waitingforreport',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './waitingforreport.html',
  styleUrl: './waitingforreport.css',
})
export class Waitingforreport {
  @Input() reportName: string = 'EcoScore Assessment';
  @Input() facilityName: string = 'Your Facility';
  @Input() estimatedTime: string = '2-3 Days';
}
