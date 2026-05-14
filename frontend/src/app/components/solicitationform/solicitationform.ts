// solicitation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AuditSolicitationCreateRequest, AuditSolicitationService } from '../../services/audit-solicitation.service';

@Component({
  selector: 'app-solicitation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitationform.html',
})
export class SolicitationFormComponent implements OnInit {
  solicitationForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  private readonly companyId = 2;

  facilityTypes = [
    'Education',
    'Healthcare',
    'Manufacturing',
    'Office Building',
    'Retail',
    'Warehouse',
    'Data Center',
    'Other'
  ];

  auditTypes = [
    { id: 'carbon', label: 'Carbon Emissions', icon: '🌿' },
    { id: 'water', label: 'Water Usage', icon: '💧' },
    { id: 'energy', label: 'Energy Efficiency', icon: '⚡' },
    { id: 'waste', label: 'Waste Management', icon: '♻️' }
  ];

  preferredTimeSlots = [
    'Morning (8:00 AM - 12:00 PM)',
    'Afternoon (12:00 PM - 5:00 PM)',
    'Full Day'
  ];

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly auditSolicitationService: AuditSolicitationService
  ) {
    this.solicitationForm = this.fb.group({
      // Step 1: Facility Information
      facilityName: ['', [Validators.required, Validators.minLength(2)]],
      facilityType: ['', Validators.required],
      facilityDescription: ['', [Validators.required, Validators.minLength(20)]],

      // Location Details
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],

      // Step 2: Facility Details
      totalArea: ['', [Validators.required, Validators.min(1)]],
      areaUnit: ['sqm', Validators.required],
      numberOfFloors: ['', [Validators.required, Validators.min(1)]],
      numberOfEmployees: ['', [Validators.required, Validators.min(1)]],
      operatingHours: ['', Validators.required],
      yearBuilt: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      lastRenovationYear: [''],

      // Step 3: Audit Preferences
      auditTypes: this.fb.array([], Validators.required),
      preferredStartDate: ['', Validators.required],
      preferredEndDate: ['', Validators.required],
      preferredTimeSlot: ['', Validators.required],
      accessRestrictions: [''],
      specialInstructions: [''],

      // Step 4: Contact Information
      contactName: ['', Validators.required],
      contactTitle: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      alternateContactName: [''],
      alternateContactPhone: [''],

      // Additional
      website: [''],
      existingCertifications: [''],
      previousAuditDate: [''],
      agreedToTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    const status = this.auditSolicitationService.getCachedStatus();
    if (status === true) {
      this.router.navigateByUrl('/reportcomplete');
      return;
    }
    if (status === false) {
      this.router.navigateByUrl('/waitingforreport');
      return;
    }
  }

  get auditTypesArray(): FormArray {
    return this.solicitationForm.get('auditTypes') as FormArray;
  }

  onAuditTypeChange(event: Event, auditId: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.auditTypesArray.push(this.fb.control(auditId));
    } else {
      const index = this.auditTypesArray.controls.findIndex(x => x.value === auditId);
      if (index >= 0) {
        this.auditTypesArray.removeAt(index);
      }
    }
  }

  isAuditTypeSelected(auditId: string): boolean {
    return this.auditTypesArray.value.includes(auditId);
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(
          this.solicitationForm.get('facilityName')?.valid &&
          this.solicitationForm.get('facilityType')?.valid &&
          this.solicitationForm.get('facilityDescription')?.valid &&
          this.solicitationForm.get('streetAddress')?.valid &&
          this.solicitationForm.get('city')?.valid &&
          this.solicitationForm.get('state')?.valid &&
          this.solicitationForm.get('country')?.valid &&
          this.solicitationForm.get('postalCode')?.valid
        );
      case 2:
        return !!(
          this.solicitationForm.get('totalArea')?.valid &&
          this.solicitationForm.get('numberOfFloors')?.valid &&
          this.solicitationForm.get('numberOfEmployees')?.valid &&
          this.solicitationForm.get('operatingHours')?.valid &&
          this.solicitationForm.get('yearBuilt')?.valid
        );
      case 3:
        return !!(
          this.auditTypesArray.length > 0 &&
          this.solicitationForm.get('preferredStartDate')?.valid &&
          this.solicitationForm.get('preferredEndDate')?.valid &&
          this.solicitationForm.get('preferredTimeSlot')?.valid
        );
      case 4:
        return !!(
          this.solicitationForm.get('contactName')?.valid &&
          this.solicitationForm.get('contactTitle')?.valid &&
          this.solicitationForm.get('contactEmail')?.valid &&
          this.solicitationForm.get('contactPhone')?.valid &&
          this.solicitationForm.get('agreedToTerms')?.valid
        );
      default:
        return false;
    }
  }

  onSubmit(): void {
    if (!this.solicitationForm.valid) {
      this.solicitationForm.markAllAsTouched();
      return;
    }

    const raw = this.solicitationForm.getRawValue();
    const payload: AuditSolicitationCreateRequest = {
      facilityName: raw.facilityName,
      facilityType: raw.facilityType,
      facilityDescription: raw.facilityDescription,
      streetAddress: raw.streetAddress,
      city: raw.city,
      state: raw.state,
      country: raw.country,
      postalCode: raw.postalCode,
      totalArea: Number(raw.totalArea),
      areaUnit: raw.areaUnit,
      numberOfFloors: Number(raw.numberOfFloors),
      numberOfEmployees: Number(raw.numberOfEmployees),
      operatingHours: raw.operatingHours,
      yearBuilt: Number(raw.yearBuilt),
      lastRenovationYear: this.normalizeOptionalNumber(raw.lastRenovationYear),
      existingCertifications: this.normalizeOptionalText(raw.existingCertifications),
      previousAuditDate: this.normalizeOptionalText(raw.previousAuditDate),
      auditTypes: JSON.stringify(this.auditTypesArray.value),
      preferredStartDate: raw.preferredStartDate,
      preferredEndDate: raw.preferredEndDate,
      preferredTimeSlot: raw.preferredTimeSlot,
      accessRestrictions: this.normalizeOptionalText(raw.accessRestrictions),
      specialInstructions: this.normalizeOptionalText(raw.specialInstructions),
      contactName: raw.contactName,
      contactTitle: raw.contactTitle,
      contactEmail: raw.contactEmail,
      contactPhone: raw.contactPhone,
      alternateContactName: this.normalizeOptionalText(raw.alternateContactName),
      alternateContactPhone: this.normalizeOptionalText(raw.alternateContactPhone),
      website: this.normalizeOptionalText(raw.website),
      agreedToTerms: raw.agreedToTerms,
      solved: false,
      companyId: this.companyId,
    };

    this.auditSolicitationService.createSolicitation(payload).subscribe({
      next: () => {
        this.auditSolicitationService.setCachedStatus(false);
        this.router.navigateByUrl('/waitingforreport');
      },
      error: (error) => {
        console.error('Failed to submit audit solicitation', error);
      },
    });
  }

  private normalizeOptionalText(value: unknown): string | null {
    if (typeof value !== 'string') {
      return value == null ? null : String(value);
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeOptionalNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  fillMockData(): void {
    const auditTypeIds = ['carbon', 'water', 'energy', 'waste'];
    while (this.auditTypesArray.length) {
      this.auditTypesArray.removeAt(0);
    }
    auditTypeIds.forEach((id) => this.auditTypesArray.push(this.fb.control(id)));

    this.solicitationForm.patchValue({
      facilityName: 'Universidad Autonoma de Occidente (UAO)',
      facilityType: 'Education',
      facilityDescription: 'University campus focused on sustainability research and green infrastructure.',
      streetAddress: 'Calle 25 # 115-85',
      city: 'Cali',
      state: 'Valle del Cauca',
      country: 'Colombia',
      postalCode: '760030',
      totalArea: 65000,
      areaUnit: 'sqm',
      numberOfFloors: 6,
      numberOfEmployees: 1200,
      operatingHours: 'Mon-Fri 7:00 AM - 9:00 PM',
      yearBuilt: 1992,
      lastRenovationYear: 2022,
      existingCertifications: 'LEED Gold, ISO 14001',
      previousAuditDate: '2024-11-15',
      preferredStartDate: '2026-06-03',
      preferredEndDate: '2026-06-10',
      preferredTimeSlot: this.preferredTimeSlots[0],
      accessRestrictions: 'Lab areas require safety briefing and PPE.',
      specialInstructions: 'Use visitor parking at Gate 2. Check in at Security Office.',
      contactName: 'Laura Martinez',
      contactTitle: 'Sustainability Coordinator',
      contactEmail: 'laura.martinez@uao.edu.co',
      contactPhone: '+57 2 318 8000',
      alternateContactName: 'Andres Gomez',
      alternateContactPhone: '+57 300 555 0199',
      website: 'https://www.uao.edu.co',
      agreedToTerms: true,
    });
  }
}
