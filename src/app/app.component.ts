import { Component, OnDestroy } from '@angular/core';
import { UserDetails } from './user-details';
import { AuthenticationService } from './authentication.service';
import { UserProfileService } from './user-profile.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private title: string;
  titleSubject: Subject<string> = new BehaviorSubject<string>('');
  private titleSubscription: Subscription;
  private title$ = this.titleSubject.asObservable();


  constructor(private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService) {
    this.authenticationService.whenReady
      .then(() => {
        if (this.authenticationService.isSignedIn) {
          this.userProfileService.updateProfile();
        }
      },
      (error) => console.error(error));

    this.titleSubscription = this.title$.subscribe((title) => this.title = title );
  }

  ngOnDestroy() {
    this.titleSubscription.unsubscribe();
  }
}
