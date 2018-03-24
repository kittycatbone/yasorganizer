import { Injectable } from '@angular/core';
import { UserDetails } from './user-details';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

declare var gapi: any;

@Injectable()
export class UserProfileService {
  profile;

  constructor(private authenticationService: AuthenticationService) { }

  getProfile(googleUser?): UserDetails {
    const currUser = (googleUser === undefined) ? this.authenticationService.auth2.currentUser.get() : googleUser;
    this.profile = currUser.getBasicProfile();
    const userDetails: UserDetails = new UserDetails();

    try {
      userDetails.name = this.profile.getName();
      userDetails.imageUrl = this.profile.getImageUrl();
      userDetails.email = this.profile.getEmail();
      userDetails.givenName = this.profile.getGivenName();
      userDetails.familyName = this.profile.getFamilyName();
      console.log('ID: ' + this.profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + this.profile.getName());
      console.log('Image URL: ' + this.profile.getImageUrl());
      console.log('Email: ' + this.profile.getEmail()); // This is null if the 'email' scope is not present.
    } catch (e) {
      console.error(e);
    }

    return userDetails;
  }

}
