import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AuditResponse, AuditService } from '../../services/audit.service';

interface ReportData {
  id: string;
  device_id: string;
  temperatura_celsius: string;
  temperatura_descripcion: string;
  temperatura_fahrenheit: string;
  fahrenheit_descripcion: string;
  humedad: string;
  humedad_descripcion: string;
  acelerometro: string;
  acelerometro_descripcion: string;
  luz: string;
  luz_descripcion: string;
  preguntas: string;
  preguntas_descripcion: string;
  calidad_aire_imagen: string;
  calidad_aire_descripcion: string;
  riesgo_biologico_imagen: string;
  riesgo_biologico_descripcion: string;
  materiales_peligrosos_imagen: string;
  materiales_peligrosos_descripcion: string;
  gestion_residuos_imagen: string;
  gestion_residuos_descripcion: string;
  consumo_energetico: string;
  consumo_energetico_descripcion: string;
  biodiversidad_imagen: string;
  biodiversidad_descripcion: string;
  gestion_agua_imagen: string;
  gestion_agua_descripcion: string;
  contaminacion_auditiva_imagen: string;
  contaminacion_auditiva_descripcion: string;
  conclusions: string;
  created_at: string;
}

interface ParsedAccelerometer {
  x: number;
  y: number;
  z: number;
}

interface ParsedQuestion {
  index: number;
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-eco-paladin-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eco-paladin-results.html',
  styleUrl: './eco-paladin-results.css',
})
export class EcoPaladinResults {
  private readonly companyName = 'uao';

  reportData: ReportData = {
    id: '15',
    device_id: 'DEVICE-003',
    temperatura_celsius: '20.10',
    temperatura_descripcion: 'Low ambient temperature with stable measurements.',
    temperatura_fahrenheit: '68.18',
    fahrenheit_descripcion: 'Fahrenheit value indicates cool environmental conditions.',
    humedad: '40.00',
    humedad_descripcion: 'Humidity remains within ideal laboratory range.',
    acelerometro: '{"x":0.00,"y":0.00,"z":9.80}',
    acelerometro_descripcion: 'Device remained completely stable during monitoring.',
    luz: '650 lux',
    luz_descripcion: 'Natural lighting conditions are excellent.',
    preguntas: '[1,1,1,1,1,1,1,1,1,1]',
    preguntas_descripcion: 'All environmental evaluation questions passed successfully.',
    calidad_aire_imagen: '/calidadaire/3.png',
    calidad_aire_descripcion: 'Air quality sensors report optimal atmospheric conditions.',
    riesgo_biologico_imagen: '/riesgobiologico/3.png',
    riesgo_biologico_descripcion: 'No biological threats identified in controlled area.',
    materiales_peligrosos_imagen: '/materialespeligrosos/3.png',
    materiales_peligrosos_descripcion: 'No hazardous substances currently used in operations.',
    gestion_residuos_imagen: '/gestionresiduos/3.png',
    gestion_residuos_descripcion: 'Waste management policies fully implemented.',
    consumo_energetico: '21.15',
    consumo_energetico_descripcion: 'Solar-assisted systems significantly reduced energy usage.',
    biodiversidad_imagen: '/biodiversidad/3.png',
    biodiversidad_descripcion: 'Protected ecological zone remains unaffected.',
    gestion_agua_imagen: '/gestionagua/3.png',
    gestion_agua_descripcion: 'Automated water control systems working efficiently.',
    contaminacion_auditiva_imagen: '/contaminacionauditiva/3.png',
    contaminacion_auditiva_descripcion: 'Acoustic contamination remains below minimum thresholds.',
    conclusions: 'No conclusions provided.',
    created_at: '2026-05-09 09:12:03'
  };

  selectedImage: string | null = null;
  selectedImageLabel = '';
  private readonly fallbackImages: Record<string, string> = {
    calidadaire: 'https://imgs.search.brave.com/Xvwt89otxNjIvLe6KlnqqrhHfLnA42sGweNH1MPRE_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5mb2JhZS5jb20v/cmVzaXplci92Mi9F/TFhRVFVJUVFCRTNU/SEVSMllITDVOTkdS/VS5qcGc_YXV0aD02/MjU3MTY3ZDVhNTBi/YWM0MjBkYjVmMzIy/MjQwODM5OWZhYzdl/MjBhMmVlODEzZTFm/MzU5NTgzZGE2MzBj/YWUyJnNtYXJ0PXRy/dWUmd2lkdGg9MzUw/JmhlaWdodD0xOTcm/cXVhbGl0eT04NQ',
    riesgobiologico: 'https://imgs.search.brave.com/oGR90crit3nmTZD3l5q8FQ2IZvl3XVKe4f275o4eFHY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQx/MDE1MTczOS9waG90/by9hYmFuZG9uZWQt/cGxhc3RpYy1wYWNr/YWdpbmctd2l0aC1z/dGFnbmFudC1kaXJ0/eS13YXRlci1pbnNp/ZGUtY2xvc2Utdmll/dy1tb3NxdWl0b2Vz/LWluLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz0tV2hzTzFL/NWxFbmxXbjExU2NR/bk1VQTJqbEUzMjhF/R0QzaGtzaEpNNHFV/PQ',
    materialespeligrosos: 'https://imgs.search.brave.com/bYVyLc83aiUcCcL0_pZIlD9C1G3LAL2Eo8vlkXwGGyU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi91bmEt/ZW1waW5hZGEtbGFk/ZXJhLXF1ZS1kZXNj/aWVuZGUtYWwtciVD/MyVBRG8tbGxlbm8t/ZGUtYmFzdXJhLXRp/cmFkYS1wb3ItbG9z/LWx1Z2FyZSVDMyVC/MW9zLWVuLWVsLXB1/ZWJsby1sYWRlcmFz/LWNvbnN0cnVjY2kl/QzMlQjNuLWFsZGVh/cy0yMDYwMjg0OTYu/anBn',
    gestionresiduos: 'https://imgs.search.brave.com/cZnEruor6_dwGzx8LN-tzTmbm0IYP-Yhw1gZDnESm98/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2FuZWNhcy5jb20u/Y28vaW1hZ2VzLzIw/MjUvbm92aWVtYnJl/Ly8zLXJlY2ljbGFq/ZS1lbi1pbnN0aXR1/Y2lvbmVzLWVkdWNh/dGl2YXMud2VicA',
    biodiversidad: 'https://imgs.search.brave.com/0LAB5h6T9wQcBpXfPDJEKf6Ma0ObTzNMnjylgdPVXCs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly85MG1p/bnV0b3MuY28vd3At/Y29udGVudC91cGxv/YWRzLzIwMjUvMDIv/YmlvZGl2ZXJzaWRh/ZC1lbi1lbC1WYWxs/ZS1kZWwtQ2F1Y2Et/MTUzNng4NjQtMS0y/NzB4MjcwLmpwZw',
    gestionagua: 'https://imgs.search.brave.com/a5ivXmI77PgitK41zXP-AOKWsJX3F3VsNZEUP9ByMpM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/bWl0ZWNvLmdvYi5l/cy9lcy9hZ3VhL3Rl/bWFzL19qY3JfY29u/dGVudC9yb290L2Nv/bnRhaW5lci9jb250/YWluZXItbWFpbi9j/b250YWluZXItYmFu/bmVyL2Nhcm91c2Vs/X2NvbnRhaW5lci9j/YXJvdXNlbF9pdGVt/MTQuY29yZWltZy5q/cGVnLzE3NzgyMzM2/NTE2MjAvYWZvcm8t/bW9udGF2ZXJuZXIt/ODI1eDE5MC0yLXRj/bTMwLTEzNjIyNC5q/cGVn',
    contaminacionauditiva: 'https://imgs.search.brave.com/d5zuzlEMN6VQGwM9OrrQP0CZBzHv7mwJXIVP58q8m1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZXVzdG9uOTYuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE4/LzAzL0NvbnRhbWlu/YWNpJUMzJUIzbi1h/YyVDMyVCQXN0aWNh/LTMwMHgxNzYuanBn',
  };

  constructor(
    private readonly auditService: AuditService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.loadAudit();
  }

  get parsedAccelerometer(): ParsedAccelerometer {
    try {
      return JSON.parse(this.reportData.acelerometro);
    } catch {
      return { x: 0, y: 0, z: 0 };
    }
  }

  get parsedQuestions(): ParsedQuestion[] {
    const questionLabels = [
      'Temperature within safe range',
      'Humidity levels acceptable',
      'Air quality meets standards',
      'No biological hazards detected',
      'Waste properly managed',
      'Energy consumption optimized',
      'Water usage efficient',
      'Noise levels acceptable',
      'Biodiversity impact minimal',
      'Overall compliance achieved'
    ];

    try {
      const values: number[] = JSON.parse(this.reportData.preguntas);
      return values.map((val, idx) => ({
        index: idx + 1,
        label: questionLabels[idx] || `Question ${idx + 1}`,
        value: val === 1
      }));
    } catch {
      return [];
    }
  }

  get questionsPassedCount(): number {
    return this.parsedQuestions.filter(q => q.value).length;
  }

  get totalQuestions(): number {
    return this.parsedQuestions.length;
  }

  get ecoScore(): number {
    const tempScore = this.getTemperatureScore();
    const humidityScore = this.getHumidityScore();
    const questionsScore = (this.questionsPassedCount / this.totalQuestions) * 100;
    return Math.round((tempScore + humidityScore + questionsScore) / 3);
  }

  get formattedDate(): string {
    const date = new Date(this.reportData.created_at);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get complianceStatus(): string {
    if (this.ecoScore >= 90) return 'Excellent';
    if (this.ecoScore >= 75) return 'Good';
    if (this.ecoScore >= 50) return 'Fair';
    return 'Needs Improvement';
  }

  get statusColor(): string {
    if (this.ecoScore >= 90) return 'text-emerald-600';
    if (this.ecoScore >= 75) return 'text-teal-600';
    if (this.ecoScore >= 50) return 'text-amber-600';
    return 'text-red-600';
  }

  openImage(src: string | null | undefined, label: string): void {
    if (!src) {
      return;
    }

    this.selectedImage = src;
    this.selectedImageLabel = label;
  }

  closeImage(): void {
    this.selectedImage = null;
    this.selectedImageLabel = '';
  }

  handleImageError(event: Event, fallbackKey: string, field?: keyof ReportData): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) {
      return;
    }

    const fallback = this.fallbackImages[fallbackKey];
    if (fallback && img.src !== fallback) {
      img.src = fallback;
      if (field) {
        (this.reportData as unknown as Record<string, string>)[field] = fallback;
        this.cdr.detectChanges();
      }
      return;
    }

    img.style.display = 'none';
    const sibling = img.nextElementSibling as HTMLElement | null;
    if (sibling) {
      sibling.style.display = 'flex';
    }
  }

  private getTemperatureScore(): number {
    const temp = parseFloat(this.reportData.temperatura_celsius);
    if (temp >= 18 && temp <= 24) return 100;
    if (temp >= 15 && temp <= 28) return 75;
    return 50;
  }

  private getHumidityScore(): number {
    const humidity = parseFloat(this.reportData.humedad);
    if (humidity >= 30 && humidity <= 50) return 100;
    if (humidity >= 20 && humidity <= 60) return 75;
    return 50;
  }

  printReport(): void {
    window.print();
  }

  downloadReport(): void {
    // Implement PDF download logic
    console.log('Downloading report...');
  }

  private loadAudit(): void {
    this.auditService
      .getLatestAudit(this.companyName)
      .pipe(
        catchError((error) => {
          console.error('Failed to load audit report', error);
          return of(null);
        })
      )
      .subscribe((audit) => {
        if (!audit) {
          return;
        }

        this.reportData = this.mapAuditToReport(audit);
        this.cdr.detectChanges();
      });
  }

  private mapAuditToReport(audit: AuditResponse): ReportData {
    return {
      id: this.valueToString(audit.id),
      device_id: audit.deviceId ?? '',
      temperatura_celsius: this.formatNumber(audit.tempC),
      temperatura_descripcion: audit.tempCDesc ?? '',
      temperatura_fahrenheit: this.formatNumber(audit.tempF),
      fahrenheit_descripcion: audit.tempFDesc ?? '',
      humedad: this.formatNumber(audit.humidity),
      humedad_descripcion: audit.humidityDesc ?? '',
      acelerometro: this.formatAccelerometer(audit.accelerometer),
      acelerometro_descripcion: audit.accelerometerDesc ?? '',
      luz: this.formatLight(audit.light),
      luz_descripcion: audit.lightDesc ?? '',
      preguntas: this.formatQuestions(audit.questions),
      preguntas_descripcion: audit.questionsDesc ?? '',
      calidad_aire_imagen: this.imagePath('calidadaire'),
      calidad_aire_descripcion: audit.calidadaireDesc ?? '',
      riesgo_biologico_imagen: this.imagePath('riesgobiologico'),
      riesgo_biologico_descripcion: audit.riesgobiologicoDesc ?? '',
      materiales_peligrosos_imagen: this.imagePath('materialespeligrosos'),
      materiales_peligrosos_descripcion: audit.materialespeligrososDesc ?? '',
      gestion_residuos_imagen: this.imagePath('gestionresiduos'),
      gestion_residuos_descripcion: audit.gestionresiduosDesc ?? '',
      consumo_energetico: this.formatNumber(audit.consumoenergetico),
      consumo_energetico_descripcion: audit.consumoenergeticoDesc ?? '',
      biodiversidad_imagen: this.imagePath('biodiversidad'),
      biodiversidad_descripcion: audit.biodiversidadDesc ?? '',
      gestion_agua_imagen: this.imagePath('gestionagua'),
      gestion_agua_descripcion: audit.gestionaguaDesc ?? '',
      contaminacion_auditiva_imagen: this.imagePath('contaminacionauditiva'),
      contaminacion_auditiva_descripcion: audit.contaminacionauditivaDesc ?? '',
      conclusions: audit.conclusions ?? 'No conclusions provided.',
      created_at: audit.createdAt ?? '',
    };
  }

  private formatNumber(value: number | string | null): string {
    if (value === null || value === undefined) {
      return '';
    }

    const num = Number(value);
    if (Number.isFinite(num)) {
      return num.toFixed(2);
    }

    return this.valueToString(value);
  }

  private formatLight(value: string | null): string {
    const base = this.valueToString(value);
    if (!base) {
      return '';
    }

    if (/^\d+(\.\d+)?$/.test(base)) {
      return `${base} lux`;
    }

    return base;
  }

  private formatQuestions(value: string | null): string {
    if (!value) {
      return '[]';
    }

    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      return trimmed;
    }

    const digits = trimmed.replace(/[^01]/g, '');
    if (!digits) {
      return '[]';
    }

    const values = digits.split('').map((digit) => Number(digit));
    return JSON.stringify(values);
  }

  private formatAccelerometer(value: string | null): string {
    if (!value) {
      return '{"x":0,"y":0,"z":0}';
    }

    const trimmed = value.trim();
    try {
      const parsed = JSON.parse(trimmed);
      return this.formatAccelerometerValue(parsed);
    } catch {
      return this.formatAccelerometerValue(trimmed);
    }
  }

  private formatAccelerometerValue(value: unknown): string {
    if (Array.isArray(value) && value.length >= 3) {
      return JSON.stringify({
        x: this.toNumber(value[0]),
        y: this.toNumber(value[1]),
        z: this.toNumber(value[2]),
      });
    }

    if (value && typeof value === 'object') {
      const anyValue = value as { x?: unknown; y?: unknown; z?: unknown };
      if (anyValue.x !== undefined || anyValue.y !== undefined || anyValue.z !== undefined) {
        return JSON.stringify({
          x: this.toNumber(anyValue.x),
          y: this.toNumber(anyValue.y),
          z: this.toNumber(anyValue.z),
        });
      }
    }

    return '{"x":0,"y":0,"z":0}';
  }

  private toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  private valueToString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private imagePath(folder: string): string {
    return `/${folder}/3.png`;
  }
}
