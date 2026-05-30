import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import DOMPurify from 'dompurify';
import { LabService } from '../../services/lab.service';

@Component({
  selector: 'app-lab-training',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lab-training.html',
  styleUrl: './lab-training.css',
})
export class LabTraining {
  readonly tabs = [
    {
      id: 'canopy',
      label: 'Canopy Echo',
      blurb: 'Flora signal reflection',
    },
    {
      id: 'aquifer',
      label: 'Aquifer Trace',
      blurb: 'Water flow mapping',
    },
    {
      id: 'soil',
      label: 'Soil Pulse',
      blurb: 'Ground sample runner',
    },
  ] as const;

  activeTab: (typeof this.tabs)[number]['id'] = 'canopy';

  xssInput = '<img src=x onerror=alert(1)>';
  xssUnsafeHtml: SafeHtml | null = null;
  xssSafeHtml: string = '';

  ssrfUrl = 'http://example.com';
  ssrfOutput = '';

  rceCmd = 'date';
  rceOutput = '';

  error = '';

  constructor(
    private readonly labService: LabService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  // WARNING: Intentionally unsafe render for XSS training only.
  runXssUnsafe(): void {
    this.clearError();
    this.labService.getXss(this.xssInput, false).subscribe({
      next: (html) => {
        this.xssUnsafeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: (err) => this.handleError(err),
    });
  }

  runXssSecure(): void {
    this.clearError();
    this.labService.getXss(this.xssInput, true).subscribe({
      next: (html) => {
        this.xssSafeHtml = DOMPurify.sanitize(html);
      },
      error: (err) => this.handleError(err),
    });
  }

  runSsrf(secure: boolean): void {
    this.clearError();
    this.labService.getSsrf(this.ssrfUrl, secure).subscribe({
      next: (res) => {
        this.ssrfOutput = JSON.stringify(res, null, 2);
      },
      error: (err) => this.handleError(err),
    });
  }

  runRce(secure: boolean): void {
    this.clearError();
    this.labService.getRce(this.rceCmd, secure).subscribe({
      next: (res) => {
        this.rceOutput = JSON.stringify(res, null, 2);
      },
      error: (err) => this.handleError(err),
    });
  }

  setTab(tabId: (typeof this.tabs)[number]['id']): void {
    this.activeTab = tabId;
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
