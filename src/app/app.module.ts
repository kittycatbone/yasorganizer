import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserProfileService } from './user-profile.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthenticationService } from './authentication.service';
import { TasksComponent } from './tasks/tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { AuthGuardService } from './auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { msg: '' }
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    TasksComponent,
    CalendarComponent,
    CalendarDayComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false })
  ],
  providers: [
    AuthenticationService,
    UserProfileService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
