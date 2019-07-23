import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiComponent {
  @Input() set hex(hex: string) {
    this.emojiHex = `&#x${hex};`;
  }

  @Input()
  @HostBinding('style.font-size.px')
  size = 20;

  emojiHex: string;
}
