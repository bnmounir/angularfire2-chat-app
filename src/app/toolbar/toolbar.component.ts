import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../models/User';
import { Channel } from '../models/Channel';
import map from 'lodash/map';
import { take } from 'rxjs/operators';
import { ToolbarService } from './toolbar.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input()
  user: User;
  channels: Channel[] = [];

  constructor(
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService,
    private _afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this._db
      .object<Channel>('/channels')
      .valueChanges()
      .pipe(take(1))
      .subscribe(channels => {
        // console.log('channels are: ', channels);
        map(channels, (channel, key) => {
          // console.log('channels are: ', channel);
          this.channels.push({
            key,
            name: channel.name
          });
          // console.log('line 37 channels are: ', this.channels);
        });
      });

    this._db
      .list('/channels', ref => {
        return ref
          .orderByChild('timestamp')
          .startAt(Date.now())
          .limitToLast(1);
      })
      .valueChanges()
      .subscribe(channels => {
        // console.log('line 49 channels are: ', channels);
        channels.forEach((channel: any) => {
          // console.log('channel logs 51: ', channel);
          this.channels.push({
            key: channel.key,
            name: channel.name
          });
        });
      })
      .unsubscribe();
  }

  onChannelClick(channel: Channel) {
    //..
    this._toolbarService.selectChannel(channel);
  }
}
