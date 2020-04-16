import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Player, GamePlayer } from 'dart3-sdk';

import { GameWizardStep } from '@game/models';

@Component({
  selector: 'app-game-wizard-players',
  templateUrl: './game-wizard-players.component.html',
  styleUrls: ['./game-wizard-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWizardPlayersComponent {
  @Input() players: Player[] = [];
  @Input() set selectedPlayers(players: GamePlayer[]) {
    const allPlayingIds = players.map(({ playerId }) => playerId);
    const curPlayingIds = this.playing.map(({ id }) => id);
    const curAvailableIds = this.available.map(({ id }) => id);

    this.playing = [
      ...this.playing.filter(({ id }) => allPlayingIds.includes(id)),
      ...this.players.filter(({ id }) => !curPlayingIds.includes(id) && allPlayingIds.includes(id)),
    ];

    this.available = [
      ...this.available.filter(({ id }) => !allPlayingIds.includes(id)),
      ...this.players.filter(({ id }) => ![...curAvailableIds, ...allPlayingIds].includes(id)),
    ];
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() add = new EventEmitter<Player>();
  @Output() remove = new EventEmitter<Player>();

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

      if (event.container.id === 'playing') {
        this.add.emit(event.item.data);
      } else if (event.container.id === 'available') {
        this.remove.emit(event.item.data);
      }
    }
  }

  dragStarted() {
    document.body.style.cursor = 'grabbing';
  }

  dragReleased() {
    document.body.style.cursor = 'initial';
  }

  start() {
    console.log(this.playing);
  }
}
