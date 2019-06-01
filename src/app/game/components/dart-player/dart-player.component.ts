import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Player } from '@game/models';

@Component({
  selector: 'app-dart-player',
  templateUrl: './dart-player.component.html',
  styleUrls: ['./dart-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartPlayerComponent {
  @Input() players: Player[];
  @Input() playerTurn: number;
}
