import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: Observable<User>;
  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this._authService.currentUser$.subscribe((user: any) => {
      this.user = user;
    });
    // console.log('user from home component ', this.user);

    // this.delayTheCall();
  }

  // delayTheCall() {
  //   window.setTimeout(() => {
  //     console.log('user from home component set time out ', this.user);
  //   }, 1000);
  // }
}
