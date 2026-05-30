import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import DOMPurify from 'dompurify';
import { LabService } from '../../services/lab.service';

@Component({
  selector: 'app-floral-protection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './floral-protection.html',
  styleUrl: './floral-protection.css',
})
export class FloralProtection {
  readonly navLinks = [
    { path: '/water', label: 'Water Operations', sub: 'Intake + compliance' },
    { path: '/floralprotection', label: 'Floral Protection', sub: 'Habitat safeguards' },
    { path: '/energyresources', label: 'Energy Resources', sub: 'Utility planning' },
  ];

  memoInput = '<img src=x onerror=alert(1)>';
  draftPreview: SafeHtml | null = null;
  policyPreview = '';
  error = '';

  constructor(
    private readonly labService: LabService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  // WARNING: Intentionally unsafe render for training only. Do not use in production.
  runDraftPreview(): void {
    this.clearError();
    this.labService.getXss(this.memoInput, false).subscribe({
      next: (html) => {
        this.draftPreview = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: (err) => this.handleError(err),
    });
  }

  runPolicyPreview(): void {
    this.clearError();
    this.labService.getXss(this.memoInput, true).subscribe({
      next: (html) => {
        this.policyPreview = DOMPurify.sanitize(html);
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
