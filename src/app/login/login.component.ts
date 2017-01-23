import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../core/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'ca-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  onLoginFormSubmit(f: NgForm) {
    const {username, password} = f.value;

    this.authService.authenticate(username, password)
      .subscribe(() => this.router.navigate(['']), err => console.log(err));
  }
}
