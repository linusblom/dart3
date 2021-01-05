import { FormGroup } from '@angular/forms';
import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { GameOption, GameWizardStep } from '@game/models';
import { Player, GameType, TeamPlayer, MetaData } from 'dart3-sdk';

@Component({
  selector: 'game-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent {
  @Input() option: GameOption;
  @Input() form: FormGroup;
  @Input() step = GameWizardStep.SelectGame;
  @Input() players: Player[] = [];
  @Input() selectedPlayers: TeamPlayer[] = [];
  @Input() selected = false;
  @Input() meta = {} as MetaData;
  @Input() loading = false;

  @Output() changeStep = new EventEmitter<GameWizardStep>();
  @Output() changeType = new EventEmitter<GameType>();
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() start = new EventEmitter<void>();
  @Output() addPlayer = new EventEmitter<number>();
  @Output() removePlayer = new EventEmitter<number>();

  @HostBinding('style.background-color') get backgroundColor() {
    return this.option.color;
  }

  @HostBinding('style.width.%') get flexBasis() {
    if (this.step === GameWizardStep.SelectGame) {
      return 25;
    }

    return this.selected ? 100 : 0;
  }

  Step = GameWizardStep;

  setGame(type: GameType) {
    this.changeType.emit(type);
    this.changeStep.emit(type ? GameWizardStep.GameSettings : GameWizardStep.SelectGame);
  }
}
