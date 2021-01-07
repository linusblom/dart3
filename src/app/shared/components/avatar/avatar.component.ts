import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: '',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() set size(size: number) {
    this.width = size;
    this.height = size;
    this.minWidth = size;
    this.minHeight = size;
  }

  @Input() set url(url: string) {
    if (url) {
      this.backgroundImage = `url(${url})`;
    }
  }

  @HostBinding('style.background-image') backgroundImage = '';
  @HostBinding('style.width.px') width = 50;
  @HostBinding('style.height.px') height = 50;
  @HostBinding('style.min-width.px') minWidth = 50;
  @HostBinding('style.min-height.px') minHeight = 50;
}
