import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditResponse {
  id: number;
  deviceId: string;
  companyName: string;
  tempC: number | string | null;
  tempCDesc: string | null;
  tempF: number | string | null;
  tempFDesc: string | null;
  humidity: number | string | null;
  humidityDesc: string | null;
  accelerometer: string | null;
  accelerometerDesc: string | null;
  light: string | null;
  lightDesc: string | null;
  questions: string | null;
  questionsDesc: string | null;
  calidadaire: string | null;
  calidadaireDesc: string | null;
  riesgobiologico: string | null;
  riesgobiologicoDesc: string | null;
  materialespeligrosos: string | null;
  materialespeligrososDesc: string | null;
  gestionresiduos: string | null;
  gestionresiduosDesc: string | null;
  consumoenergetico: number | string | null;
  consumoenergeticoDesc: string | null;
  biodiversidad: string | null;
  biodiversidadDesc: string | null;
  gestionagua: string | null;
  gestionaguaDesc: string | null;
  contaminacionauditiva: string | null;
  contaminacionauditivaDesc: string | null;
  createdAt: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly baseUrl = 'http://127.0.0.1:8080/api/audit';

  constructor(private readonly http: HttpClient) {}

  getLatestAudit(companyName: string): Observable<AuditResponse> {
    const safeName = encodeURIComponent(companyName);
    return this.http.get<AuditResponse>(`${this.baseUrl}/${safeName}`);
  }
}
