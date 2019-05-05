import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() set avatarUrl(avatarUrl: string) {
    this.showPlaceHolder = !avatarUrl;
    this.url = `url('${avatarUrl}')`;
  }
  @Input() playerName = 'Player';
  @Input() playerColor = '#FFFFFF';
  @Input() size = 50;

  url = '';
  showPlaceHolder = false;
}
