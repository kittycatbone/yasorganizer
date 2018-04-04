import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private app: AppComponent) {
  }

  ngOnInit() {
    console.log('INIT CALENDAR');
    this.app.title = 'Calendar View';
  }

}
