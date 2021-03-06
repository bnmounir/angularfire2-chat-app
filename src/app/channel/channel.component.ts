import { Component, OnInit } from '@angular/core';
import { Form, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToolbarService } from '../toolbar/toolbar.service';
import { Channel } from '../models/Channel';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  createChannelForm: Form;
  name = new FormControl('', [Validators.required]);
  channelsRef: any;

  constructor(
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) {
    this.channelsRef = this._db.list('/channels');
  }

  ngOnInit() {}

  onCreateChannelButtonClick() {
    this.channelsRef
      .push({
        name: this.name.value,
        timestamp: Date.now()
      })
      .then(channel => {
        const c: Channel = {
          key: channel.key,
          name: this.name.value
        };
        this._toolbarService.currentChannel$.next(c);
        this._router.navigate(['']);
      });
  }
}
