import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor(private readonly oauthService: OAuthService) {}

  ngOnInit(): void {
    void this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setStorage(localStorage);

    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initCodeFlow();
    }
  }


}
