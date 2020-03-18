import { Component, Input, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import { GameType } from 'dart3-sdk';

import { GameTypeSelect } from '@game/models';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-type-select',
  templateUrl: './game-type-select.component.html',
  styleUrls: ['./game-type-select.component.scss'],
})
export class GameTypeSelectComponent implements OnInit {
  @Input() game: GameTypeSelect;

  @Output() play = new EventEmitter<GameType>();

  @HostBinding('style.background-color') get backgroundColor() {
    return this.game.color;
  }

  variant = new FormControl('', Validators.required);

  ngOnInit() {
    this.variant.setValue(this.game.types[0]);
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
