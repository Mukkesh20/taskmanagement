import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable, NgZone } from '@angular/core';
import * as store from 'store';

const MINUTES_UNITL_AUTO_LOGOUT = 30 // in Minutes
const CHECK_INTERVALL = 1000 // in ms
const STORE_KEY = 'lastAction';
const LOGOUT_TIME = 'logoutTime'

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.check();
    this.initListener();
    this.initInterval();
  }

  get lastAction() {
    return parseInt(store.get(STORE_KEY));
  }
  set lastAction(value) {
    store.set(STORE_KEY, value);
    const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    store.set(LOGOUT_TIME, timeleft);
  }

  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
    });
  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVALL);
    })
  }

  reset() {
    this.lastAction = Date.now();
  }

  check() {
    const now = Date.now();
    const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    var userLoggedin = false
    this.authService.user.subscribe(user=>{
      !user ? userLoggedin=false : userLoggedin=true;
  })

    this.ngZone.run(() => {
      if (isTimeout && userLoggedin) {
        this.authService.logout();
        localStorage.removeItem('lastAction');
        localStorage.removeItem('logoutTime');
        this.router.navigate(['/auth']);
      }
    });
  }
}
