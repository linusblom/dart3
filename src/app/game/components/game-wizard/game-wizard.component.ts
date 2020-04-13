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
import { Player, GameType } from 'dart3-sdk';

@Component({
  selector: 'app-game-wizard',
  templateUrl: './game-wizard.component.html',
  styleUrls: ['./game-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWizardComponent {
  @Input() game: GameOption;
  @Input() form: FormGroup;
  @Input() step = GameWizardStep.SelectGame;
  @Input() players: Player[] = [];

  @Output() changeStep = new EventEmitter<GameWizardStep>();
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostBinding('style.background-color') get backgroundColor() {
    return this.game.color;
  }

  @HostBinding('style.width.%') get flexBasis() {
    if (this.step === GameWizardStep.SelectGame) {
      return 25;
    }

    return this.selected ? 100 : 0;
  }

  Step = GameWizardStep;

  get selected() {
    return this.game.variants.includes(this.form.get('variant').value);
  }

  setGame(variant: GameType) {
    this.form.patchValue({ variant });
    this.changeStep.emit(variant ? GameWizardStep.GameSettings : GameWizardStep.SelectGame);
  }
}
