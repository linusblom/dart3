import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() avatarUrl: string;
  @Input() name = '';
  @Input() color = '#FFFFFF';
  @Input() size = 50;

  get nameChars() {
    const names = this.name.split(' ');

    return names.length > 1
      ? names.slice(0, 2).reduce((chars, name) => `${chars}${name.charAt(0)}`, '')
      : this.name.slice(0, 2);
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
