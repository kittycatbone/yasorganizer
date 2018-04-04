import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { UserDetails } from '../user-details';
import { AuthenticationService } from '../authentication.service';
import { UserProfileService } from '../user-profile.service';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // @Input()
  userDetails: UserDetails;
  userSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.userSubscription =
      this.userProfileService.getProfileObs()
        .subscribe(
          (user) => {
            this.userDetails = user;
            this.ref.detectChanges();
            console.log('user observable updated');
          },
          (error) => {
            console.log('error updating observable');
            console.log(error);
          }
        );
    this.authenticationService.whenReady
      .then(() => {
        if (this.authenticationService.isSignedIn) {
          console.log('rendering signin button');
          gapi.signin2.render('google-login', {
            'scope': 'profile email',
            'width': 160,
            'longtitle': false,
            'theme': '',
            'onsuccess': this.signIn.bind(this),
            'onfailure': function(error) { console.error(error); }
          });
        }
      },
      (error) => console.error(error));
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  signIn() {
    this.userProfileService.updateProfile();
  }

  getProfile(isSignedIn) {
    if (isSignedIn) {
      this.userDetails = this.userProfileService.getProfile();
      this.ref.detectChanges();
      console.log('retrieved profile');
    } else {
      console.log('no user logged in');
    }
  }

}
