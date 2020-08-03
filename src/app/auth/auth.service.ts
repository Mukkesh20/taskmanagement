import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from './user.model';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';



// export interface responseInterface {
//     access_token: string,
//     user_id:{
//       "username" : string,
//     }
//     status: string,
//     expires_in: string,
//     registered?: boolean
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);


  constructor(private http: HttpClient,
    private router: Router,
    //public jwtHelper: JwtHelperService
    ) {

  }

  public isAuthenticated(): boolean {
    const jwtHelper: JwtHelperService = new JwtHelperService();
    const userData: { access_token: string, expires_in: number } = JSON.parse(localStorage.getItem('userData'))
    if(userData){
    console.log(userData.expires_in)
    var isTokenExpired;
    if(userData.expires_in > new Date().getTime()){
      isTokenExpired = false
    }
    else{
      isTokenExpired = true
    }
    console.log(isTokenExpired + "--")
    console.log(jwtHelper.isTokenExpired(isTokenExpired))
    return jwtHelper.isTokenExpired(isTokenExpired);
  }
  else{
    return;
  }
  }


  private handleAuth(username: string, password: string, access_token: string, expires_in: number) {

    //const expirationDate = new Date(expires_in);
    const user = new User(
      username,
      password,
      access_token,
      expires_in
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user))
  }


  signup(username: string, email: string, password: string, phoneNumber: string, gender: string, age: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('contentType', 'application/json');
    headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    return this.http.post<any>('https://nestjs-authentication.herokuapp.com/auth/signup',

      {
        username: username,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender,
        age: age
      },
      {
        headers: headers
      }
    ).pipe(catchError(this.handleError),
      tap(responseData => {


      }))

  }


  signin(username: string, password: string, ) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('contentType', 'application/json');
    headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    return this.http.post<any>('https://nestjs-authentication.herokuapp.com/auth/signin',

      {
        username: username,
        password: password,

      },
      {
        headers: headers
      }
    ).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleAuth(
          responseData.email,
          responseData.password,
          responseData.access_token,
          +responseData.expires_in
        )
      }
      )
    )

  }

  autologin() {
    const userData: { email: string, password: string, access_token: string, expires_in: number } = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return;
    }
    const newLoadedUser = new User(userData.email, userData.password, userData.access_token, userData.expires_in)
    if (newLoadedUser.token) {
      this.user.next(newLoadedUser)
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');


  }

  autoLogout(expirationDuration: number) {
    const userData: { email: string, password: string, access_token: string, expires_in: number } = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return;
    }
    if(userData.expires_in < new Date().getTime())
    {
      this.user.next(null);
      this.router.navigate(['./auth']);
      localStorage.removeItem('userData');
    }else {
      return ;
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An Unknown Error Occured!!'
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error) {
      case ('Not Found'): {
        errorMessage = 'Username doesnot exist';
        break;
      }
      case ('Unauthorized'): {
        errorMessage = 'Password is incorrect';
        break;
      }
      case ('Conflict'): {
        errorMessage = 'Duplicate Username/Email';
        break;
      }
      case ('EMAIL_EXISTS'): {
        errorMessage = 'This Email already exist';
        break;
      }
    }
    return throwError(errorMessage);
  }



}
