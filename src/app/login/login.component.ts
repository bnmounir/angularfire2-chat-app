import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  createUserForm: FormGroup;
  isNewUser = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _db: AngularFireDatabase,
    private _router: Router
  ) {}

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    const buildGroup = () => {
      return this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    };

    const newUserBuildGroup = () => {
      return this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        username: ['', [Validators.required]]
      });
    };

    this.loginForm = buildGroup();

    this.createUserForm = newUserBuildGroup();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onLoginSubmitButtonClick({ value, valid }: { value: any; valid: boolean }) {
    if (this.loginForm.valid) {
      this._authService
        .login(value.email, value.password)
        .then(user => this._router.navigate(['/home']));
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }
  onCreateUserSubmitButtonClick({
    value,
    valid
  }: {
    value: any;
    valid: boolean;
  }) {
    // console.log(this.createUserForm);
    if (this.createUserForm.valid) {
      this._authService
        .createUser(value.email, value.password)
        .then(data => {
          const usersRef = this._db.list('/users');
          usersRef.update(data.user.uid, {
            email: data.user.email,
            avatar: 'https://picsum.photos/50',
            username: value.username,
            timestamp: Date.now()
          });
        })
        .then(() => this._router.navigate(['/home']));
    } else {
      this.validateAllFormFields(this.createUserForm);
    }
  }
}
