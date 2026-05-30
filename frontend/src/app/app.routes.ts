import { Routes } from '@angular/router';
import { Companyhome } from './components/companyhome/companyhome';
import { EcoLeafIcon } from './components/eco-leaf-icon/eco-leaf-icon';
import { EcoPaladinButton } from './components/eco-paladin-button/eco-paladin-button';
import { EcoPaladinResults } from './components/eco-paladin-results/eco-paladin-results';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { SolicitationFormComponent } from './components/solicitationform/solicitationform';
import { Paladinappointments } from './components/paladinappointments/paladinappointments';
import { Reportcomplete } from './components/reportcomplete/reportcomplete';
import { Paladinbuildreport } from './components/paladinbuildreport/paladinbuildreport';
import { Waitingforreport } from './components/waitingforreport/waitingforreport';
import { LabTraining } from './components/lab-training/lab-training';
import { WaterOperations } from './components/water-ops/water-ops';
import { FloralProtection } from './components/floral-protection/floral-protection';
import { EnergyResources } from './components/energy-resources/energy-resources';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  { path: 'home', component: Companyhome },
  { path: 'companyhome', component: Companyhome },
  { path: 'eco-leaf-icon', component: EcoLeafIcon },
  { path: 'eco-paladin-button', component: EcoPaladinButton },
  { path: 'eco-paladin-results', component: EcoPaladinResults },
  { path: 'reportcomplete', component: Reportcomplete },
  { path: 'paladinappointments', component: Paladinappointments },
  { path: 'paladinbuildreport', component: Paladinbuildreport },
  { path: 'waitingforreport', component: Waitingforreport },
  { path: 'solicitation', component: SolicitationFormComponent },
  { path: 'lab', component: LabTraining },
  { path: 'water', component: WaterOperations },
  { path: 'floralprotection', component: FloralProtection },
  { path: 'energyresources', component: EnergyResources },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/home' },
];
