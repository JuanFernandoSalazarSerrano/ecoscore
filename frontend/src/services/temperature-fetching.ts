import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface TempResponse {
  average_c?: number;
  unit?: string;
  samples_count?: number;
}

interface HumidityResponse {
  average_humidity?: number;
  unit?: string;
  samples_count?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TemperatureFetching {

  private readonly tempUrl = 'http://localhost:8080/api/sensor-readings/temperature';
  private readonly humidityUrl = 'http://localhost:8080/api/sensor-readings/humidity';

  constructor(private readonly http: HttpClient) {}

  /**
   * Returns average temperature in C, or null if not available.
   */
  getAverageC(): Observable<number | null> {
    return this.http.get<TempResponse>(this.tempUrl).pipe(
      map((res) => (res && typeof res.average_c === 'number' ? res.average_c : null)),
      catchError(() => of(null))
    );
  }

  /**
   * Returns average humidity in %, or null if not available.
   */
  getAverageHumidity(): Observable<number | null> {
    return this.http.get<HumidityResponse>(this.humidityUrl).pipe(
      map((res) => (res && typeof res.average_humidity === 'number' ? res.average_humidity : null)),
      catchError(() => of(null))
    );
  }
}
