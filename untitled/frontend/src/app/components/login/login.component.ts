import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;

  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
      } else {
        this.router.navigateByUrl('/login');
      }
    })
  }

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;

    if (form.invalid) {
      return;
    }

    //form.reset();
    this.userService.loginUser(email, password);
    form.reset();
    console.log(email, password);
  }

  reg() {
    this.router.navigateByUrl('/registration');
  }
}
