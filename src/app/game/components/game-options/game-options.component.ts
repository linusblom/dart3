import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, Input, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import { GameType } from 'dart3-sdk';

import {
  GameOption,
  GameOptionStep,
  availableBets,
  availableSets,
  availableLegs,
} from '@game/models';

@Component({
  selector: 'app-game-options',
  templateUrl: './game-options.component.html',
  styleUrls: ['./game-options.component.scss'],
})
export class GameOptionsComponent implements OnInit {
  @Input() game: GameOption;
  @Input() step = GameOptionStep.SelectGame;

  @Output() stepChange = new EventEmitter<GameOptionStep>();

  @HostBinding('style.background-color') get backgroundColor() {
    return this.game.color;
  }

  @HostBinding('style.width.%') get flexBasis() {
    if (this.step === GameOptionStep.SelectGame) {
      return 25;
    }

    return this.selected ? 100 : 0;
  }

  Step = GameOptionStep;

  bets = availableBets;
  sets = availableSets;
  legs = availableLegs;
  selected = false;
  form = new FormGroup({
    type: new FormControl('', Validators.required),
    bet: new FormControl(10, Validators.required),
    sets: new FormControl(1, Validators.required),
    legs: new FormControl(1, Validators.required),
  });

  ngOnInit() {
    this.form.get('type').setValue(this.game.types[0]);
  }

  onStepChange(step: GameOptionStep) {
    this.stepChange.emit(step);

    switch (step) {
      case GameOptionStep.SelectGame:
        this.selected = false;
        break;
      case GameOptionStep.GameSettings:
        this.selected = true;
        break;
    }
  }

  typeName(type: GameType) {
    switch (type) {
      case GameType.Three01SingleInDoubleOut:
      case GameType.Five01SingleInDoubleOut:
        return 'Single in - Double out';
      case GameType.Three01SDoubleInDoubleOut:
      case GameType.Five01DoubleInDoubleOut:
        return 'Double in - Double out';
      default:
        return type;
    }
  }
}
