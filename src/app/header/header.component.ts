import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedin = false;

  constructor(private authService : AuthService) {

  }

  ngOnInit(): void {
    this.authService.user.subscribe(user=>{
      this.isLoggedin= !user ? false : true;
  })
  }

  onLogout(){
    this.authService.logout();
}

}
