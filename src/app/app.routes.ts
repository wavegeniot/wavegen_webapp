import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () =>
        import('./components/dashboard/dashboard.component')
        .then((componet) => componet.DashboardComponent)
    },
    {
        path: 'login',
        loadComponent: () =>
        import('./components/login/login.component')
        .then((componet) => componet.LoginComponent)
    },
    {
        path: '',
        loadComponent: () =>
        import('./components/landing/landing.component')
        .then((componet) => componet.LandingComponent)
    },
    {
        path: '*',
        loadComponent: () =>
        import('./components/landing/landing.component')
        .then((componet) => componet.LandingComponent)
    },
];
