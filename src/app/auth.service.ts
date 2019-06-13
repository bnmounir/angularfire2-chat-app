import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './models/User';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$: Observable<User> = this.currentUserSubject.asObservable();
  loggedOut$: Subject<boolean> = new Subject<boolean>();
  userProfile;

  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase
  ) {
    this.user = this._afAuth.authState;
    this._afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        const userID = user.uid;
        this._db
          .list<User>(`/users/${userID}`)
          .valueChanges()
          .pipe(takeUntil(this.loggedOut$))
          .subscribe((userData: any) => {
            const currentUser: User = {
              email: userData[1],
              uid: userID,
              username: userData[3],
              avatar: userData[0],
              timestamp: userData[2]
            };
            this.currentUserSubject.next(currentUser);
          });
      } else {
        this.loggedOut$.next(true);
      }
    });
  }

  login(email: string, password: string) {
    return this._afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  createUser(email: string, password: string) {
    return this._afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this._afAuth.auth.signOut();
  }
}
