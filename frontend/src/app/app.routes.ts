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
  { path: 'solicitation', component: SolicitationFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/home' },
];
