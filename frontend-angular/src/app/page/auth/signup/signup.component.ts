import { Component, OnInit } from '@angular/core';
import { APIData, User } from '../../../@core/service/models/api.data.structure';
import { APIService } from '../../../@core/service/api.service';
import { error } from 'protractor';
@Component({
  selector: 'app-login',
  templateUrl: './template/signup.component.html',
  styleUrls: ['./template/signup.component.css']
})
export class SignupComponent implements OnInit {
  private email;
  private password;
  private name;
  private passwordConfirmation;
  private signupMessage;

  constructor(private _apiService:APIService) { }

  ngOnInit() {
  }

  signupClick(){
    const user = <User>{};
// conflict as username isn't defined in the new schema
    //    user.username=this.username;
    user.email = this.email;
    user.password = this.password;
    user.name= this.name;
    console.log("hello there 0");
    if(this.email != null && this.password != null&& this.passwordConfirmation!=null && this.name!=null){
      if(this.password==this.passwordConfirmation){
        console.log("hello there 1");
        this._apiService.signup(user).subscribe((apiresponse: APIData)=>{
          this.signupMessage = apiresponse.msg;
          console.log("hello there 2");
          if( apiresponse.msg.includes('Welcome') ){
            console.log("hello there 3");
            localStorage.setItem('token', apiresponse.data);
          }
        },(error: APIData)=>{
          this.signupMessage = error.msg;
        })
      }
      else{
        this.signupMessage="Password doesn't match";
      }
  } else
    this.signupMessage = 'Username or Password Can not Be Empty ';
  }

}
