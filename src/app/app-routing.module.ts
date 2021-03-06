import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { AppointmentListComponent } from './cal-utils/appointment-list/appointment-list.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './core/auth.guard';
import { ChartsComponent } from './cal-utils/charts/charts.component';
import { ResourcesComponent } from './cal-utils/resources/resources.component';
import { AllResourcesComponent } from './all-resources/all-resources.component'


const routes: Routes = [
    { path: 'allresources', component: AllResourcesComponent, canActivate: [AuthGuard] },
    { path: 'resources', component: ResourcesComponent, canActivate: [AuthGuard] },
    { path: 'welcome', component: MyCalendarComponent, canActivate: [AuthGuard] },
    { path: 'ragister', component: AppointmentListComponent, canActivate: [AuthGuard] },
    { path: 'charts', component: ChartsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginPageComponent },    
    { path: '', redirectTo: 'allresources', pathMatch: 'full', canActivate: [AuthGuard] }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
