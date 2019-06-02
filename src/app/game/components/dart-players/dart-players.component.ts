import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Player } from '@game/models';

@Component({
  selector: 'app-dart-players',
  templateUrl: './dart-players.component.html',
  styleUrls: ['./dart-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartPlayersComponent {
  @Input() players: Player[];
  @Input() playerTurn: number;
}
