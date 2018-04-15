import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AppComponent } from '../app.component';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { AuthenticationService } from '../authentication.service';
import { Event } from '../event';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { LOADING_PIC } from '../constants';
import { Subscription } from 'rxjs/Subscription';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  // events = new Array<Event>();
  events = new Map<string, Event>();
  events$: Observable<Event[]>;
  nextPageToken: string;
  loadingPic: string;
  runOnce = false;
  userSubscription: Subscription;

  constructor(private app: AppComponent,
              private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.app.titleSubject.next('Calendar View');
    this.loadingPic = LOADING_PIC;

    gapi.load('client:auth2', {
      callback: () => {
        console.log('initializing client:auth2.');
        gapi.client.init({
          apiKey: 'AIzaSyD3U1A4o9HpptxNC19nOivJFmvxP4kP4t8',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(this.subscribeUser.bind(this));
      },
      onerror: (error) => console.error(error)
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  loadEvents() {
    const minTime = new Date();
    // minTime.setMonth(minTime.getMonth() - 1);
    console.log(this.nextPageToken);
    return gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': minTime.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'pageToken': this.nextPageToken,
      'orderBy': 'startTime'
    }).then((response) => {
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
          isDayEvent,
          item.htmlLink
        );
        // if (this.events.find((element) => (element.id === currEvent.id)) === undefined) {
        //   this.events.push(currEvent);
        // }
        if (!this.events.has(currEvent.id)) {
          this.events.set(currEvent.id, currEvent);
        }
      }

      this.events$ = of(Array.from(this.events.values()));
      console.log(response.result);
      console.log(this.events$);
      this.ref.detectChanges();
    });
  }

  subscribeUser() {
    this.userSubscription =
      this.userProfileService.getProfileObs()
      .subscribe(
        (user) => {
          this.events.clear();
          this.nextPageToken = undefined;
          this.loadEvents().then(console.log('loaded events'));
        },
        (error) => {
          console.log('error updating observable');
          console.log(error);
        }
      );
  }
}
