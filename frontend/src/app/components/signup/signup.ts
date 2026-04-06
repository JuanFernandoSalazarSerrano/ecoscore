import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SignUpForm {
  name: string;
  industry: string;
  is_verified: boolean;
  website: string;
  description: string;
  city: string;
  state: string;
  country: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
})
export class SignupComponent {
  formData: SignUpForm = {
    name: '',
    industry: '',
    is_verified: false,
    website: '',
    description: '',
    city: '',
    state: '',
    country: '',
  };

  industries = [
    'Financial Services',
    'Technology',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Energy',
    'Real Estate',
    'Transportation',
    'Agriculture',
    'Education',
    'Other',
  ];

  countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Japan',
    'Singapore',
    'Brazil',
    'India',
    'Other',
  ];

  isLoading = false;
  currentStep = 1;
  totalSteps = 2;

  get isStep1Valid(): boolean {
    return !!(this.formData.name && this.formData.industry && this.formData.website);
  }

  get isStep2Valid(): boolean {
    return !!(this.formData.city && this.formData.state && this.formData.country);
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isStep1Valid) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (!this.isStep1Valid || !this.isStep2Valid) {
      return;
    }

    this.isLoading = true;

    console.log('Sign up submitted:', this.formData);

    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
