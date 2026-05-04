// solicitation-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-solicitation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitationform.html',
})
export class SolicitationFormComponent {
  solicitationForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;

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

  constructor(private fb: FormBuilder) {
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
    if (this.solicitationForm.valid) {
      console.log('Form submitted:', this.solicitationForm.value);
      // Handle form submission
    } else {
      this.solicitationForm.markAllAsTouched();
    }
  }
}
