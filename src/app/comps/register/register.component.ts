import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    ID: new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    Email: new FormControl("", [Validators.required, Validators.email]),
    Password: new FormControl("", Validators.required),
    PassConf: new FormControl("", Validators.required),
    Username: new FormControl("", Validators.required),
  });
  secondForm = new FormGroup({
    Fname: new FormControl("", Validators.required),
    Lname: new FormControl("", Validators.required),
    City: new FormControl("", Validators.required),
    Street: new FormControl("", Validators.required),
  });

  constructor(private usersService: UsersService, private router: Router) { }
  citiesArray: string[] = ["Jerusalem", "Tel-Aviv", "Haifa", "Ashdod", "Rishon-Leziyyon", "Beer-sheba", "Petah-Tikva", "Netanya", "Holon", "Bnei-brak"];
  idWarning: boolean = false;
  passWarning: boolean = false;
  nextStepBlock: boolean = true;

  ngOnInit() {
  }

  progressRegister() {
    if (this.registerForm.value.PassConf !== this.registerForm.value.Password) {
      this.passWarning = true;
      setTimeout(() => { this.passWarning = false; }, 1000);
    } else {
      this.usersService.checkIdAvailable(this.registerForm.value.ID).subscribe(data => {
        if (data.IdAvailable) {
          // pass & ID OK!
          this.nextStepBlock = false;
        } else {
          this.idWarning = true;
          setTimeout(() => { this.idWarning = false; }, 1500);
        }
      });
    }
  }

  goBack() {
    this.nextStepBlock = true;
  }

  sendData() {
    let userDetails = {
      first: {
        ID: this.registerForm.value.ID,
        Email: this.registerForm.value.Email,
        Username: this.registerForm.value.Username,
        Password: this.registerForm.value.Password
      },
      second: {
        Fname: this.secondForm.value.Fname,
        Lname: this.secondForm.value.Lname,
        City: this.secondForm.value.City,
        Street: this.secondForm.value.Street
      }
    }
   this.usersService.registerNewUser(userDetails).subscribe(data=> {
       if (data.approve) {
         this.usersService.userNameEventEmitter.emit(data.user.Fname);
         this.router.navigate(['']);
       }
   });
  }

}
