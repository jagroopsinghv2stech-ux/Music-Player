import { Routes } from '@angular/router';
import { SignUpComponent } from './components/Sign-Up/Sign-Up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path:'',
        component:SignUpComponent
    },
    {
        path:'dashboard',
        component:DashboardComponent
    }
];
