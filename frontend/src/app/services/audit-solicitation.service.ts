import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AuditSolicitationResponse {
  id: number;
  solved: boolean | null;
  companyId: number | null;
}

export interface AuditSolicitationCreateRequest {
  facilityName: string;
  facilityType: string;
  facilityDescription: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  totalArea: number;
  areaUnit: string;
  numberOfFloors: number;
  numberOfEmployees: number;
  operatingHours: string;
  yearBuilt: number;
  lastRenovationYear: number | null;
  existingCertifications: string | null;
  previousAuditDate: string | null;
  auditTypes: string;
  preferredStartDate: string;
  preferredEndDate: string;
  preferredTimeSlot: string;
  accessRestrictions: string | null;
  specialInstructions: string | null;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  alternateContactName: string | null;
  alternateContactPhone: string | null;
  website: string | null;
  agreedToTerms: boolean;
  solved: boolean;
  companyId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditSolicitationService {
  private readonly baseUrl = 'http://127.0.0.1:8080/api/audit-solicitations';
  private readonly storageKey = 'auditSolicitationSolved';

  constructor(private readonly http: HttpClient) {}

  createSolicitation(payload: AuditSolicitationCreateRequest): Observable<AuditSolicitationResponse> {
    return this.http.post<AuditSolicitationResponse>(this.baseUrl, payload);
  }

  loadLatestStatus(companyId: number): Observable<boolean | null> {
    if (!companyId || companyId <= 0) {
      this.setCachedStatus(null);
      return of(null);
    }

    return this.http
      .get<AuditSolicitationResponse>(`${this.baseUrl}/company/${companyId}/latest`)
      .pipe(
        map((res) => {
          const status = res?.solved === true ? true : res?.solved === false ? false : null;
          this.setCachedStatus(status);
          return status;
        }),
        catchError((error) => {
          if (error?.status === 404 || error?.status === 204) {
            this.setCachedStatus(null);
            return of(null);
          }
          console.error('Failed to load audit solicitation status', error);
          const cached = this.getCachedStatus();
          return of(cached === undefined ? null : cached);
        })
      );
  }

  getCachedStatus(): boolean | null | undefined {
    const value = localStorage.getItem(this.storageKey);
    if (value === null) {
      return undefined;
    }
    if (value === 'none') {
      return null;
    }
    return value === 'true';
  }

  setCachedStatus(status: boolean | null): void {
    if (status === null) {
      localStorage.setItem(this.storageKey, 'none');
      return;
    }
    localStorage.setItem(this.storageKey, status ? 'true' : 'false');
  }
}
