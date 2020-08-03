import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  signupSuccess= false
  isSignupMode = false;
  signupForm : FormGroup;
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;
  signupSub : Subscription;
  loginSub : Subscription
  errorMsg=null ;
  isLoading = false

  constructor(private authService: AuthService,
              private router : Router) {
    this.showPassword = false;
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      gender: new FormControl('Male', [Validators.required]),
      phoneNumber: new FormControl(null, Validators.required),
      age: new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.min(13)])
  }),

  this.loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    password: new FormControl('', Validators.required),
})
  }



  onSignupClick(){
    this.isSignupMode=true;
  }

  onLogClick(){
    this.isSignupMode=false;
  }

  onSignup(){
    this.submitted = true;
    this.isLoading = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      this.isLoading = false;
        return "Invalif form";
    }
    const username = this.signupForm.value['username']
    const email = this.signupForm.value['email']
    const password = this.signupForm.value['password']
    const phoneNumber = this.signupForm.value['phoneNumber']
    const gender = this.signupForm.value['gender']
    const age = this.signupForm.value['age']
    console.log(username, email, password, phoneNumber, gender, age)
    console.log(this.signupForm)

    if(this.signupForm){

    // display form values on success
    this.signupSub = this.authService.signup(username, email, password, phoneNumber, gender, age).subscribe(resData => {
      this.isSignupMode = false
      this.signupSuccess = true
      this.isLoading=false;
      this.errorMsg=null
      //this.router.navigate(['/']);
    }, errorMessage => {
      console.log(errorMessage)
      this.errorMsg = errorMessage
      this.isLoading=false;
     })

  }
}

onSignin(){
  this.isLoading = true;
  if (this.loginForm.invalid) {
    this.isLoading = false;
    return "Invalif form";
  }
  const username = this.loginForm.value['username']
  const password = this.loginForm.value['password']
  console.log(this.loginForm)

  if(this.loginForm){

  // display form values on success
  this.loginSub = this.authService.signin(username, password).subscribe(resData => {
    console.log(resData)
    this.isLoading=false;
    this.errorMsg=null
    this.router.navigate(['/task/create']);
  }, errorMessage => {
    console.log(errorMessage)
    this.errorMsg = errorMessage
    this.isLoading=false;
   })
   //this.loginForm.reset();
}

}

  onReset(){
    this.submitted = false;
    this.signupForm.reset();
  }

  togglePasswordVisiblity(){
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(){
  //   if(this.isSignupMode !== false){
  //   this.loginSub.unsubscribe();
  // }
  // else{
  //   this.signupSub.unsubscribe();
  // }

}
}
