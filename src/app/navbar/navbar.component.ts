import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { UserDetails } from '../user-details';
import { AuthenticationService } from '../authentication.service';
import { UserProfileService } from '../user-profile.service';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';


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
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {
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
          gapi.signin2.render('my-gsignin2', {
            'width': 180,
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

  async signOut() {
    await this.authenticationService.signOut();
    this.authenticationService.setSignIn();
    this.getProfile();
  }

  signIn(googleUser) {
    console.log('signed in');
    this.authenticationService.setSignIn();
    this.getProfile();
  }

  getProfile() {
    this.userProfileService.updateProfile();
    this.route.data.subscribe((data) => {
      if (data.redirectUrl !== undefined) {
        this.router.navigate([data.redirectUrl]);
      }
    }).unsubscribe();
  }


}
