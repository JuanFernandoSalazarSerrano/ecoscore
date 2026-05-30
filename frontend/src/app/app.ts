import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './auth.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor(
    private readonly oauthService: OAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    void this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setStorage(localStorage);

    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initCodeFlow();
      return;
    }

    this.redirectAfterLogin();
  }

  private redirectAfterLogin(): void {
    const currentPath = this.router.url.split('?')[0] || '/';
    if (!this.shouldRedirectFrom(currentPath)) {
      return;
    }

    const role = this.getRoleFromAccessToken();
    if (role === 'AUDITOR') {
      void this.router.navigate(['/paladinappointments']);
      return;
    }

    if (role === 'COMPANY') {
      void this.router.navigate(['/companyhome']);
    }
  }

  private shouldRedirectFrom(path: string): boolean {
    return path === '/' || path === '/home' || path === '/companyhome' || path === '/login';
  }

  private getRoleFromAccessToken(): string | null {
    const token = this.oauthService.getAccessToken();
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const payload = JSON.parse(this.decodeBase64Url(parts[1]));
      const roles = payload?.roles;

      if (Array.isArray(roles) && roles.length > 0) {
        return String(roles[0]);
      }

      if (typeof roles === 'string') {
        return roles;
      }
    } catch {
      return null;
    }

    return null;
  }

  private decodeBase64Url(value: string): string {
    let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    return atob(base64);
  }


}
