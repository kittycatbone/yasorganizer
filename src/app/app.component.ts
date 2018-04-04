import { Component } from '@angular/core';
import { UserDetails } from './user-details';
import { AuthenticationService } from './authentication.service';
import { UserProfileService } from './user-profile.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  // userDetails: UserDetails = new UserDetails();
  // user$: Observable<UserDetails>;

  constructor(private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService) {
    this.authenticationService.whenReady
      .then(() => {
        if (this.authenticationService.isSignedIn) {
          this.userProfileService.updateProfile();
        }
      },
      (error) => console.error(error));
  }
}
