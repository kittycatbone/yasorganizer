import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { AuthenticationService } from '../authentication.service';
import { Event } from '../event';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  events = new Array<Event>();
  events$: Observable<Event[]>;
  nextPageToken: string;

  constructor(private app: AppComponent,
              private authenticationService: AuthenticationService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('INIT CALENDAR');
    this.app.titleSubject.next('Calendar View');

    gapi.load('client:auth2', {
      callback: () => {
        console.log('initializing client:auth2.');
        gapi.client.init({
          apiKey: 'AIzaSyD3U1A4o9HpptxNC19nOivJFmvxP4kP4t8',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(this.loadEvents.bind(this));
      },
      onerror: (error) => console.error(error)
    });
  }

  loadEvents() {
    const minTime = new Date();
    // minTime.setMonth(minTime.getMonth() - 1);
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': minTime.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'pageToken': this.nextPageToken,
      'orderBy': 'startTime'
    }).then((response) => {
      console.log(response.result.nextPageToken);
      this.nextPageToken = response.result.nextPageToken;
      for (const item of response.result.items) {
        const startTime = new Date();
        const endTime = new Date();
        let isDayEvent = false;

        if (item.start.dateTime !== undefined) {
          startTime.setTime(Date.parse(item.start.dateTime));
          endTime.setTime(Date.parse(item.end.dateTime));
        }
        else if (item.start.date !== undefined) {
          startTime.setTime(Date.parse(item.start.date));
          endTime.setTime(Date.parse(item.end.date));
          isDayEvent = true;
        }

        const currEvent = new Event(
          item.id,
          item.summary,
          item.location,
          item.description,
          startTime,
          endTime,
          isDayEvent
        );
        this.events.push(currEvent);
      }

      this.events$ = of(this.events);
      console.log(response.result.items);
      console.log(this.events$);
      this.ref.detectChanges();
    });
  }

}
