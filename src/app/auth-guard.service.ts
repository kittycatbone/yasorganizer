import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('checking if link can be activated');
    const url = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authenticationService.isSignedIn) {
      this.router.config = this.router.config.map(
        (currRoute) => {
          if (currRoute.path === 'login') {
            currRoute.data = { msg: '' };
          }
          return currRoute;
        }
      );

      console.log(this.router.config);
      this.router.resetConfig(this.router.config);

      return true;
    }

    this.router.config = this.router.config.map(
      (currRoute) => {
        if ((currRoute.path === 'login') && (url !== '/login')) {
          currRoute.data = { msg: `you need to be logged in to enter ${url}`, redirectUrl: url };
        }
        return currRoute;
      }
    );

    console.log(this.router.config);
    this.router.resetConfig(this.router.config);

    // Navigate to login screen and return false
    this.router.navigate(['/login']);

    return false;
  }

}
