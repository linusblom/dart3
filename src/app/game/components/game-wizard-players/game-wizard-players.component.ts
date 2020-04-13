import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Player } from 'dart3-sdk';

import { GameWizardStep } from '@game/models';

@Component({
  selector: 'app-game-wizard-players',
  templateUrl: './game-wizard-players.component.html',
  styleUrls: ['./game-wizard-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWizardPlayersComponent {
  @Input() set players(players: Player[]) {
    this.available = [...players];
  }

  @Output() cancel = new EventEmitter<void>();

  playing: Player[] = [];
  available: Player[] = [];

  Step = GameWizardStep;

  onPlayerDrop(event: CdkDragDrop<Player[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  start() {
    console.log(this.playing);
  }
}
