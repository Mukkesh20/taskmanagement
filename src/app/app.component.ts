import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AutoLogoutService } from './auth/auto-logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'taskmanagement';

  constructor(private authService: AuthService,
              private autoLogout: AutoLogoutService
    ){}

 ngOnInit(){
  this.authService.autologin();
  this.autoLogout.check();
 }
}
