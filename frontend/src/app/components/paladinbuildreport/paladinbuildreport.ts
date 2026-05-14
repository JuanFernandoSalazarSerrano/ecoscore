import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface SensorField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'json' | 'image' | 'questions';
  icon: string;
  value: string | number;
  description: string;
  placeholder: string;
}

interface ReportData {
  device_id: string;
  temp_c: number;
  temp_c_desc: string;
  temp_f: number;
  temp_f_desc: string;
  humidity: number;
  humidity_desc: string;
  accelerometer: string;
  accelerometer_desc: string;
  light: string;
  light_desc: string;
  questions: string;
  questions_desc: string;
  calidadaire: string;
  calidadaire_desc: string;
  riesgobiologico: string;
  riesgobiologico_desc: string;
  materialespeligrosos: string;
  materialespeligrosos_desc: string;
  gestionresiduos: string;
  gestionresiduos_desc: string;
  consumoenergetico: number;
  consumoenergetico_desc: string;
  biodiversidad: string;
  biodiversidad_desc: string;
  gestionagua: string;
  gestionagua_desc: string;
  contaminacionauditiva: string;
  contaminacionauditiva_desc: string;
  conclusions: string;
  solved:boolean;
}

interface AuditTextareaPayload {
  device_id: string;
  temp_c_desc: string;
  temp_f_desc: string;
  humidity_desc: string;
  accelerometer_desc: string;
  light_desc: string;
  questions_desc: string;
  calidadaire_desc: string;
  riesgobiologico_desc: string;
  materialespeligrosos_desc: string;
  gestionresiduos_desc: string;
  consumoenergetico_desc: string;
  biodiversidad_desc: string;
  gestionagua_desc: string;
  contaminacionauditiva_desc: string;
  conclusions: string;
}

@Component({
  selector: 'app-paladinbuildreport',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paladinbuildreport.html',
  styleUrl: './paladinbuildreport.css',
})
export class Paladinbuildreport {
  private readonly auditUrl = 'http://127.0.0.1:8080/api/audit';
  submitState: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  submitMessage = '';

  constructor(private readonly http: HttpClient) {}

  reportData: ReportData = {
    device_id: '',
    temp_c: 0,
    temp_c_desc: '',
    temp_f: 0,
    temp_f_desc: '',
    humidity: 0,
    humidity_desc: '',
    accelerometer: '{"x":0,"y":0,"z":0}',
    accelerometer_desc: '',
    light: '',
    light_desc: '',
    questions: '[0,0,0,0,0,0,0,0,0,0]',
    questions_desc: '',
    calidadaire: '',
    calidadaire_desc: '',
    riesgobiologico: '',
    riesgobiologico_desc: '',
    materialespeligrosos: '',
    materialespeligrosos_desc: '',
    gestionresiduos: '',
    gestionresiduos_desc: '',
    consumoenergetico: 0,
    consumoenergetico_desc: '',
    biodiversidad: '',
    biodiversidad_desc: '',
    gestionagua: '',
    gestionagua_desc: '',
    contaminacionauditiva: '',
    contaminacionauditiva_desc: '',
    conclusions: '',
    solved:false
  };

  sensorFields: SensorField[] = [
    {
      key: 'device_id',
      label: 'Device ID',
      type: 'text',
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      value: '',
      description: '',
      placeholder: 'Enter device identifier...'
    },
    {
      key: 'temp_c',
      label: 'Temperature (Celsius)',
      type: 'number',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      value: 0,
      description: '',
      placeholder: 'Describe temperature conditions in Celsius...'
    },
    {
      key: 'temp_f',
      label: 'Temperature (Fahrenheit)',
      type: 'number',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      value: 0,
      description: '',
      placeholder: 'Describe temperature conditions in Fahrenheit...'
    },
    {
      key: 'humidity',
      label: 'Humidity (%)',
      type: 'number',
      icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
      value: 0,
      description: '',
      placeholder: 'Describe humidity levels and conditions...'
    },
    {
      key: 'accelerometer',
      label: 'Accelerometer',
      type: 'json',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      value: '{"x":0,"y":0,"z":0}',
      description: '',
      placeholder: 'Describe device stability and movement data...'
    },
    {
      key: 'light',
      label: 'Light Intensity',
      type: 'text',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
      value: '',
      description: '',
      placeholder: 'Describe lighting conditions...'
    },
    {
      key: 'questions',
      label: 'Evaluation Questions',
      type: 'questions',
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      value: '[0,0,0,0,0,0,0,0,0,0]',
      description: '',
      placeholder: 'Describe the evaluation results...'
    },
    {
      key: 'calidadaire',
      label: 'Air Quality',
      type: 'image',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      value: '',
      description: '',
      placeholder: 'Describe air quality assessment...'
    },
    {
      key: 'riesgobiologico',
      label: 'Biological Risk',
      type: 'image',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      value: '',
      description: '',
      placeholder: 'Describe biological risk evaluation...'
    },
    {
      key: 'materialespeligrosos',
      label: 'Hazardous Materials',
      type: 'image',
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      value: '',
      description: '',
      placeholder: 'Describe hazardous materials status...'
    },
    {
      key: 'gestionresiduos',
      label: 'Waste Management',
      type: 'image',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      value: '',
      description: '',
      placeholder: 'Describe waste management practices...'
    },
    {
      key: 'consumoenergetico',
      label: 'Energy Consumption',
      type: 'number',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      value: 0,
      description: '',
      placeholder: 'Describe energy consumption analysis...'
    },
    {
      key: 'biodiversidad',
      label: 'Biodiversity',
      type: 'image',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      value: '',
      description: '',
      placeholder: 'Describe biodiversity impact assessment...'
    },
    {
      key: 'gestionagua',
      label: 'Water Management',
      type: 'image',
      icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
      value: '',
      description: '',
      placeholder: 'Describe water management evaluation...'
    },
    {
      key: 'contaminacionauditiva',
      label: 'Noise Pollution',
      type: 'image',
      icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
      value: '',
      description: '',
      placeholder: 'Describe noise pollution levels...'
    }
  ];

  questionLabels: string[] = [
    'Environmental compliance verified',
    'Safety protocols in place',
    'Equipment properly calibrated',
    'Documentation complete',
    'Staff training current',
    'Emergency procedures ready',
    'Monitoring systems active',
    'Quality standards met',
    'Inspection passed',
    'Certification valid'
  ];

  get parsedQuestions(): boolean[] {
    try {
      const parsed = JSON.parse(this.reportData.questions);
      return Array.isArray(parsed) ? parsed.map((q: number) => q === 1) : [];
    } catch {
      return [];
    }
  }

  get parsedAccelerometer(): { x: number; y: number; z: number } {
    try {
      return JSON.parse(this.reportData.accelerometer);
    } catch {
      return { x: 0, y: 0, z: 0 };
    }
  }

  updateQuestion(index: number, value: boolean): void {
    try {
      const questions = JSON.parse(this.reportData.questions);
      questions[index] = value ? 1 : 0;
      this.reportData.questions = JSON.stringify(questions);
    } catch {
      // Handle error
    }
  }

  updateAccelerometer(axis: 'x' | 'y' | 'z', value: number): void {
    try {
      const accel = JSON.parse(this.reportData.accelerometer);
      accel[axis] = value;
      this.reportData.accelerometer = JSON.stringify(accel);
    } catch {
      // Handle error
    }
  }

  onImageSelected(field: SensorField, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.reportData as any)[field.key] = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  private buildTextareaPayload(): AuditTextareaPayload {
    return {
      device_id: this.reportData.device_id ?? '',
      temp_c_desc: this.reportData.temp_c_desc ?? '',
      temp_f_desc: this.reportData.temp_f_desc ?? '',
      humidity_desc: this.reportData.humidity_desc ?? '',
      accelerometer_desc: this.reportData.accelerometer_desc ?? '',
      light_desc: this.reportData.light_desc ?? '',
      questions_desc: this.reportData.questions_desc ?? '',
      calidadaire_desc: this.reportData.calidadaire_desc ?? '',
      riesgobiologico_desc: this.reportData.riesgobiologico_desc ?? '',
      materialespeligrosos_desc: this.reportData.materialespeligrosos_desc ?? '',
      gestionresiduos_desc: this.reportData.gestionresiduos_desc ?? '',
      consumoenergetico_desc: this.reportData.consumoenergetico_desc ?? '',
      biodiversidad_desc: this.reportData.biodiversidad_desc ?? '',
      gestionagua_desc: this.reportData.gestionagua_desc ?? '',
      contaminacionauditiva_desc: this.reportData.contaminacionauditiva_desc ?? '',
      conclusions: this.reportData.conclusions ?? ''
    };
  }

  generateReport(): void {
    const payload = this.buildTextareaPayload();
    this.submitState = 'sending';
    this.submitMessage = 'Sending report...';

    this.http.post(this.auditUrl, payload).subscribe({
      next: (response) => {
        this.submitState = 'success';
        this.submitMessage = 'Report sent successfully.';
        console.log('Generated Report Payload:', payload);
        console.log('Report API Response:', response);
      },
      error: (error) => {
        this.submitState = 'error';
        this.submitMessage = 'Report submission failed.';
        console.error('Report submission failed:', error);
      }
    });
  }

  clearForm(): void {
    this.reportData = {
      device_id: '',
      temp_c: 0,
      temp_c_desc: '',
      temp_f: 0,
      temp_f_desc: '',
      humidity: 0,
      humidity_desc: '',
      accelerometer: '{"x":0,"y":0,"z":0}',
      accelerometer_desc: '',
      light: '',
      light_desc: '',
      questions: '[0,0,0,0,0,0,0,0,0,0]',
      questions_desc: '',
      calidadaire: '',
      calidadaire_desc: '',
      riesgobiologico: '',
      riesgobiologico_desc: '',
      materialespeligrosos: '',
      materialespeligrosos_desc: '',
      gestionresiduos: '',
      gestionresiduos_desc: '',
      consumoenergetico: 0,
      consumoenergetico_desc: '',
      biodiversidad: '',
      biodiversidad_desc: '',
      gestionagua: '',
      gestionagua_desc: '',
      contaminacionauditiva: '',
      contaminacionauditiva_desc: '',
      conclusions: '',
      solved:false
    };
    this.submitState = 'idle';
    this.submitMessage = '';
  }
}
