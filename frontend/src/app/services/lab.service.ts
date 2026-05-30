import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabSsrfResponse {
  url: string;
  status: number;
  body: string;
  truncated: boolean;
}

export interface LabRceResponse {
  command: string;
  exit_code: number;
  output: string;
}

@Injectable({
  providedIn: 'root',
})
export class LabService {
  private readonly baseUrl = 'http://192.168.80.13:8080/lab';

  constructor(private readonly http: HttpClient) {}

  getXss(input: string, secure: boolean): Observable<string> {
    const path = secure ? 'secure/xss' : 'xss';
    return this.http.get(`${this.baseUrl}/${path}`, {
      params: { input },
      responseType: 'text',
    });
  }

  getSsrf(url: string, secure: boolean): Observable<LabSsrfResponse> {
    const path = secure ? 'secure/ssrf' : 'ssrf';
    return this.http.get<LabSsrfResponse>(`${this.baseUrl}/${path}`, {
      params: { url },
    });
  }

  getRce(cmd: string, secure: boolean): Observable<LabRceResponse> {
    const path = secure ? 'secure/rce' : 'rce';
    return this.http.get<LabRceResponse>(`${this.baseUrl}/${path}`, {
      params: { cmd },
    });
  }
}
