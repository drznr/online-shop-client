import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  entity:string = "guest";
  
  constructor(private usersService: UsersService) { }
  logOutLink:boolean = false;
  ngOnInit() {
    this.usersService.checkSession().subscribe(data=> {
       if (data.connected) {
         this.logOutLink = true;
         data.user.Fname = data.user.Fname[0].toUpperCase() + data.user.Fname.substring(1);
         this.entity = data.user.Fname;
       }
    });
    this.usersService.userNameEventEmitter.subscribe(data=> {
      this.logOutLink = true;
     data = data[0].toUpperCase() + data.substring(1);
      this.entity = data;
    });
  }

  logOut() {
    this.usersService.logOut().subscribe(data=> {
      this.logOutLink = false;
      if (!data.connected) {
        this.entity = "guest";
        this.usersService.userLogOutEventEmitter.emit(true);
      }
    });
  }

}
