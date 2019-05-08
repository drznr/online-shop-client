import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { CartsService } from '../../services/carts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });
  showWarning: boolean = false;
  disableActions: boolean = true;
  buyAction: string = "Start shopping";
  isAdminConnected:boolean = false;

  constructor(private usersService: UsersService, private cartsService: CartsService, private router: Router) { }

  ngOnInit() {
    this.usersService.checkSession().subscribe((data:any) => {
      if (data.connected) {
        if (data.isAdmin) {
          this.disableActions = false;
          this.isAdminConnected = true;
        } else {
          this.disableActions = false;
        }
      }
    });
    this.usersService.userLogOutEventEmitter.subscribe((data:any)  => {
      if (data) {
        this.buyAction = "Start shopping";
        this.disableActions = true;
        this.isAdminConnected = false;
      }
    });
    this.cartsService.openCartEventEmitter.subscribe((data:any) => {
      if (data) this.buyAction = "Resume shopping";
    })
  }
  sendData() {
    this.usersService.login(this.loginForm.value).subscribe((data:any) => {
      if (!data.approve) {
        this.showWarning = true;
        setTimeout(() => { this.showWarning = false; }, 1000);
      } else {
        if (data.isAdmin) {
          //ADMIN CONNECTED
          this.isAdminConnected = true;
          this.usersService.userNameEventEmitter.emit(data.user.Fname);
          this.usersService.userLoginEventEmitter.emit(data.user);
          this.router.navigate(['admin']);
        } else {
          //USER CONNECTED
          this.usersService.userNameEventEmitter.emit(data.user.Fname);
          this.usersService.userLoginEventEmitter.emit(data.user);
          this.disableActions = false;
          this.loginForm.reset();
        }
      }
    });
  }
}
