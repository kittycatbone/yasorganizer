import { Injectable } from '@angular/core';

declare var gapi: any;

@Injectable()
export class AuthenticationService {
  auth2;
  whenReady;

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
        client_id: '756248107036-4p4q1cl4fb2nmodsv47c50lmr0i3t83j.apps.googleusercontent.com'
      });
    }

    return this.auth2.then(() => console.log('initiated auth2'),
                    (error) => console.error(error));
  }

  getAuth() {
    return this.whenReady.then(function() { return this.auth2; } );
  }

  signInListen(listener) {
    // check if already signed in
    if (this.auth2.isSignedIn.get()) {
      this.auth2.signOut();
    }

    this.auth2.isSignedIn.listen(listener);
  }

  signOut() {
    console.log('now signing out...');
    return this.auth2.signOut();
      // .then(function () { console.log('User signed out.'); });
  }

}
