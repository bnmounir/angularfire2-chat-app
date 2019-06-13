import { Injectable } from '@angular/core';
import { Channel } from '../models/Channel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  currentChannel$ = new BehaviorSubject<Channel>(null);

  constructor() {}

  selectChannel(channel: Channel) {
    this.currentChannel$.next(channel);
  }
}
