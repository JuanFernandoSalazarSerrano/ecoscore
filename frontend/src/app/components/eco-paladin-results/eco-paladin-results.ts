import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    created_at: '2026-05-09 09:12:03'
  };

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
}
