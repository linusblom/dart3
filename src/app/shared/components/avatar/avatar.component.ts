import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() avatarUrl: string;
  @Input() name = 'Player';
  @Input() color = '#FFFFFF';
  @Input() size = 50;

  get nameChars() {
    return this.name.slice(0, 2).toUpperCase();
  }

  get styles() {
    return {
      'width.px': this.size,
      'height.px': this.size,
      'font-size.px': this.size * 0.5,
      'background-color': this.color,
      ...(this.avatarUrl && { 'background-image': `url('${this.avatarUrl}'` }),
    };
  }
}
