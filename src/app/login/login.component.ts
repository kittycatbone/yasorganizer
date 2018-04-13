import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { UserDetails } from '../user-details';
import { UserProfileService } from '../user-profile.service';
import { AuthenticationService } from '../authentication.service';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  routeSubscription: Subscription;
  navurlSubscription: Subscription;
  userDetails: UserDetails;
  msg = '';

  constructor(
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService,
    private ref: ChangeDetectorRef,
    private app: AppComponent,
    private route: ActivatedRoute,
    private router: Router) {
      app.titleSubject.next('Organizer for Yasmin');
      this.routeSubscription = route.data.subscribe((data) => {
        this.msg = data.msg;
      });
      console.log('NG CONSTRUCT');
    }

  ngOnInit() {
    this.userSubscription =
      this.userProfileService.getProfileObs()
        .subscribe(
          (user) => {
            this.userDetails = user;
            console.log('user observable updated');
            this.ref.detectChanges();
            console.log('detect changes');
          },
          (error) => {
            console.log('error updating observable');
            console.log(error);
          }
        );
    this.authenticationService.whenReady
      .then(
        () => {
          if (!this.authenticationService.isSignedIn) {
            this.renderSignIn();
          }
        },
        (error) => console.error(error));
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    if (this.navurlSubscription !== undefined) {
      this.navurlSubscription.unsubscribe();
    }
  }

  async signOut() {
    await this.authenticationService.signOut();
    this.authenticationService.setSignIn();
    this.getProfile();
    this.renderSignIn();
  }

  signInListen() {
    console.log('listening to sign in');
    this.authenticationService.signInListen(() => this.getProfile());
  }

  signIn(googleUser) {
    console.log('signed in');
    this.authenticationService.setSignIn();
    this.getProfile();
  }

  getProfile() {
    this.userProfileService.updateProfile();
    this.route.data.subscribe((data) => {
      console.log('check1');
      if (data.redirectUrl !== undefined) {
        console.log('check2');
        this.router.navigate([data.redirectUrl]);
      }
    }).unsubscribe();
  }

  renderSignIn() {
    console.log('rendering signin button');

    this.ref.detectChanges();
    gapi.signin2.render('my-gsignin2', {
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': this.signIn.bind(this),
      'onfailure': function(error) { console.error(error); }
    });
  }
}
