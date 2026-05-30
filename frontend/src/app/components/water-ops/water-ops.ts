import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LabService } from '../../services/lab.service';

@Component({
  selector: 'app-water-ops',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './water-ops.html',
  styleUrl: './water-ops.css',
})
export class WaterOperations {
  readonly navLinks = [
    { path: '/water', label: 'Water Operations', sub: 'Intake + compliance' },
    { path: '/floralprotection', label: 'Floral Protection', sub: 'Habitat safeguards' },
    { path: '/energyresources', label: 'Energy Resources', sub: 'Utility planning' },
  ];

  sourceUrl = 'http://example.com';
  output = '';
  error = '';

  constructor(private readonly labService: LabService) {}

  runPreview(secure: boolean): void {
    this.clearError();
    this.labService.getSsrf(this.sourceUrl, secure).subscribe({
      next: (res) => {
        this.output = JSON.stringify(res, null, 2);
      },
      error: (err) => this.handleError(err),
    });
  }

  private handleError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      const details = err.error ? JSON.stringify(err.error) : err.message;
      this.error = `HTTP ${err.status}: ${details}`;
      return;
    }

    this.error = String(err);
  }

  private clearError(): void {
    this.error = '';
  }
}
