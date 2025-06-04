import { Routes } from '@angular/router';

export const routes: Routes = [

    {path: '', redirectTo: 'list-report', pathMatch: 'full'},
    {path: 'list-report', loadComponent: () => import('./components/list-report/list-report.component').then(m => m.ListReportComponent)},
    {path: 'dynamic-report/:id', loadComponent: () => import('./components/report-config/report-config.component').then(m => m.ReportConfigComponent)},
    {path: 'dynamic-report', loadComponent: () => import('./components/report-config/report-config.component').then(m => m.ReportConfigComponent)},
    // {path: 'dynamic-report', loadComponent: () => import('./report/report.component').then(m => m.ReportComponent)},
];
