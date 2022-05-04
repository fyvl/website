import { Component, OnInit } from '@angular/core';
import {ResponseModel, UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {map} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myUser: any;

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map(user => {
          return user;
        })
      )
      .subscribe((data) => {
        this.myUser = data;
      });
  }

  logout() {
    this.userService.logout();
  }
}
