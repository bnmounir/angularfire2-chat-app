import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Message } from '../models/Message';
import { ToolbarService } from '../toolbar/toolbar.service';
import { Channel } from '../models/Channel';
import { User } from '../models/User';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @Input()
  user;
  // user: Observable<User>;
  messages: Message[] = [];
  channel: Channel;

  constructor(
    private _toolbarService: ToolbarService,
    private _authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase
  ) {}

  ngOnInit() {
    console.log('triggered');
    this._toolbarService.currentChannel$
      .pipe(distinctUntilChanged())
      .subscribe(channel => {
        if (channel) {
          this.channel = channel;
          this._db
            .list(`/messages/${this.channel.key}`)
            .snapshotChanges()
            .pipe(takeUntil(this._authService.loggedOut$))
            .subscribe(actions => {
              this.messages = [];
              actions.forEach((action: any) => {
                const payload = action.payload.val();
                this.messages.push({
                  userId: payload.userId,
                  message: payload.message,
                  timestamp: payload.timestamp,
                  username: payload.username,
                  avatar: payload.avatar
                });
              });
            });
          console.log(this.channel.name);
        } else {
          console.log('no Channel');
        }
      });
  }

  logout() {
    this._authService.logout().then(() => {
      this._router.navigate(['/login']);
    });
  }

  onAddMessage(message: string) {
    if (message !== '') {
      const messages = this._db.list(`/messages/${this.channel.key}`);
      messages.push({
        message,
        timestamp: Date.now(),
        username: this.user.username,
        avatar: this.user.avatar
      });
    }
  }
}
