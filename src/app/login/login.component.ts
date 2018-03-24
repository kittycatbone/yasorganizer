import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserDetails } from '../user-details';
import { UserProfileService } from '../user-profile.service';
import { AuthenticationService } from '../authentication.service';

declare var gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userDetails: UserDetails = new UserDetails();
  pageReady = false;

  constructor(private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.authenticationService.whenReady
      .then(() => {
                    if (this.authenticationService.auth2.isSignedIn.get()) {
                      this.getProfile(true);
                    }
                    else {
                      this.renderSignIn();
                    }
                    this.pageReady = true;
                  },
            (error) => console.error(error));
  }

  async signOut() {
    await this.authenticationService.signOut();
    this.getProfile(false);
    this.renderSignIn();
  }

  signInListen() {
    console.log('listening to sign in');
    this.authenticationService.signInListen(isSignedIn => this.getProfile(isSignedIn));
  }

  signIn(googleUser) {
    console.log('signed in');
    this.getProfile(true);
  }

  getProfile(isSignedIn) {
    if (isSignedIn) {
      this.userDetails = this.userProfileService.getProfile();
      console.log('retrieved profile');
    } else {
      this.userDetails.resetValues();
      console.log('no user logged in');
    }

    this.ref.detectChanges();
  }

  renderSignIn() {
    console.log('rendering signin button');

    this.ref.detectChanges();
    gapi.signin2.render('my-gsignin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': this.signIn.bind(this),
      'onfailure': function(error) { console.error(error); }
    });
  }
}
