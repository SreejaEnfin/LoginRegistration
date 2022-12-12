import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginForm!:FormGroup;
tokenData:any

constructor(private router:Router, private fb:FormBuilder, private userservice:UserService){}

ngOnInit():void{
  this.LoginForm = this.fb.group({
    uemail:['', [Validators.required, Validators.email]],
    upassword:['', [Validators.required, Validators.minLength(4)]]
  })
}

  onLogin(){
    if(this.LoginForm.valid){
this.userservice.checkUser(this.LoginForm.value).subscribe((res:any)=>{
  console.log(res);
  this.tokenData = res.data;
  console.log(this.tokenData)
  localStorage.setItem('token',this.tokenData)
 alert("Login Successfull");
  this.LoginForm.reset();
  this.router.navigate(['/dashboard']);
},(err)=>{
  console.log(err);
})
    }else{
      alert("Please check if the credentials are valid");
    }


  }

  routetoSignup(){
this.router.navigate(['/signup']);
  }

}
