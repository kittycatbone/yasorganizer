import { Injectable } from '@angular/core';
import { UserDetails } from './user-details';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs/Subject';

declare var gapi: any;

@Injectable()
export class UserProfileService {
  private user: Subject<UserDetails> = new BehaviorSubject<UserDetails>(new UserDetails());
  user$ = this.user.asObservable();

  constructor(private authenticationService: AuthenticationService) { }

  getProfile(googleUser?): UserDetails {
    const userDetails: UserDetails = new UserDetails();

    try {
      const currUser = (googleUser === undefined) ? this.authenticationService.getCurrentUser() : googleUser;
      const profile = currUser.getBasicProfile();

      userDetails.name = profile.getName();
      userDetails.imageUrl = profile.getImageUrl();
      userDetails.email = profile.getEmail();
      userDetails.givenName = profile.getGivenName();
      userDetails.familyName = profile.getFamilyName();
      console.log(userDetails);
    } catch (e) {
      console.error(e);
    }

    return userDetails;
  }

  getProfileObs(googleUser?): Observable<UserDetails> {
    return this.user$;
  }

  updateProfile(googleUser?): void {
    console.log('updating profile');
    if (this.authenticationService.isSignedIn) {
      console.log('updateProfile: signed in');
      this.user.next(this.getProfile(googleUser));
    }
    else {
      console.log('updateProfile: not signed in');
      this.user.next(new UserDetails());
    }
  }

}
