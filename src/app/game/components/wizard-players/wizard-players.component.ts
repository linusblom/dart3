import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Player, TeamPlayer, MetaData } from 'dart3-sdk';
import { FormGroup } from '@angular/forms';

import { GameWizardStep } from '@game/models';

@Component({
  selector: 'game-wizard-players',
  templateUrl: './wizard-players.component.html',
  styleUrls: ['./wizard-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardPlayersComponent {
  @Input() form: FormGroup;
  @Input() players: Player[] = [];
  @Input() bet = 0;
  @Input() meta = {} as MetaData;
  @Input() loading = false;
  @Input() set selectedPlayers(players: TeamPlayer[]) {
    const allPlayingIds = players.map(({ playerId }) => playerId);
    const curPlayingIds = this.participating.map(({ id }) => id);
    const curAvailableIds = this.available.map(({ id }) => id);

    this.participating = [
      ...this.participating.filter(({ id }) => allPlayingIds.includes(id)),
      ...this.players.filter(({ id }) => !curPlayingIds.includes(id) && allPlayingIds.includes(id)),
    ];

    this.available = [
      ...this.available.filter(({ id }) => !allPlayingIds.includes(id)),
      ...this.players.filter(({ id }) => ![...curAvailableIds, ...allPlayingIds].includes(id)),
    ];

    this.calculatePlayers();
  }

  @Output() start = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() add = new EventEmitter<Player>();
  @Output() remove = new EventEmitter<Player>();

  participating: Player[] = [];
  available: Player[] = [];
  dragging = false;
  minPlayers = 2;
  maxPlayers = 8;
  valid = false;

  Step = GameWizardStep;

  calculatePlayers() {
    const { team, tournament } = this.form.value;

    this.minPlayers = (tournament ? 4 : 2) * (team ? 2 : 1);
    this.maxPlayers = (tournament ? 32 : 8) * (team ? 2 : 1);
    this.valid =
      this.participating.length >= this.minPlayers &&
      this.participating.length <= this.maxPlayers &&
      (!team || this.participating.length % 2 === 0);
  }

  playerDrop(event: CdkDragDrop<Player[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      if (event.container.id === 'participating') {
        this.add.emit(event.item.data);
      } else if (event.container.id === 'available') {
        this.remove.emit(event.item.data);
      }
    }
  }

  playerDoubleClick(player: Player, index: number) {
    transferArrayItem(this.available, this.participating, index, this.participating.length);
    this.add.emit(player);
  }

  dragStarted() {
    document.body.style.cursor = 'grabbing';
    this.dragging = true;
  }

  dragReleased() {
    document.body.style.cursor = 'initial';
    this.dragging = false;
  }
}
