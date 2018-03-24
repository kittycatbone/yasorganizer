import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserDetails } from '../user-details';
import { AuthenticationService } from '../authentication.service';
import { UserProfileService } from '../user-profile.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userDetails: UserDetails = new UserDetails();

  constructor(private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.authenticationService.whenReady
      .then(() => {
        if (this.authenticationService.auth2.isSignedIn.get()) {
          this.getProfile(true);

          console.log('rendering signin button');
          gapi.signin2.render('my-gsignin2', {
            'scope': 'profile email',
            'width': 160,
            'longtitle': false,
            'theme': '',
            'onsuccess': this.signIn.bind(this),
            'onfailure': function(error) { console.error(error); }
          });
          console.log (this.userDetails);
        }
      },
      (error) => console.error(error));
  }

  signIn() {

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
