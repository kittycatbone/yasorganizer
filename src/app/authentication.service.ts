import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';
import { retryWhen, catchError, takeWhile } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

declare var gapi: any;

@Injectable()
export class AuthenticationService {
  private auth2;
  whenReady: Promise<any>;
  public isSignedIn: boolean;

  constructor() {
    this.whenReady =
      new Promise(function (resolve, reject) {
        gapi.load('auth2', {
          callback: resolve,
          onerror: (error) => console.error(error)
        });
      })
      .then(() => {
        console.log('loaded auth2');
        return this.initAuth();
      }, (error) => console.error(error));
  }

  private initAuth() {
    console.log('init auth started');
    this.auth2 = gapi.auth2.getAuthInstance();

    if (this.auth2 === null) {
      console.log('auth2 was undefined. initializing manually.');
      this.auth2 = gapi.auth2.init({
        client_id: '756248107036-4p4q1cl4fb2nmodsv47c50lmr0i3t83j.apps.googleusercontent.com',
        scope: 'profile email https://www.googleapis.com/auth/calendar'
      });
    }

    return this.auth2
      .then(() => {
        this.isSignedIn = this.auth2.isSignedIn.get();
        console.log('initiated auth2');
      },
      (error) => console.error(error));
  }

  getAuth() {
    return this.whenReady.then(function() { return this.auth2; } );
  }

  signInListen(listener) {
    // check if already signed in
    if (this.isSignedIn) {
      this.auth2.signOut();
      this.isSignedIn = false;
    }

    this.auth2.isSignedIn.listen(listener);
  }

  signOut() {
    console.log('now signing out...');
    return this.auth2.signOut();
  }

  setSignIn() {
    console.log('set sign in');
    if (this.auth2 === undefined) {
      this.isSignedIn = false;
    }

    this.isSignedIn = this.auth2.isSignedIn.get();
  }

  checkSignedIn(): boolean {
    console.log('check signed in');
    this.setSignIn();

    return this.isSignedIn;
  }

  getCurrentUser() {
    return this.auth2.currentUser.get();
  }
}
