import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { Transaction, TransactionType } from 'dart3-sdk';

import { TransactionPayload } from '@player/models';

@Component({
  selector: 'app-player-bank',
  templateUrl: './player-bank.component.html',
  styleUrls: ['./player-bank.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerBankComponent {
  @Input() credits = 0;
  @Input() transactions: Transaction[] = [];

  @Output() transaction = new EventEmitter<TransactionPayload>();

  iconCoins = faCoins;
  amount = new FormControl(0, [Validators.required, Validators.min(1)]);

  onDeposit() {
    this.transaction.emit({
      type: TransactionType.Deposit,
      amount: this.amount.value,
    });

    this.amount.reset(0);
  }

  onWithdraw() {
    this.transaction.emit({
      type: TransactionType.Withdrawal,
      amount: this.amount.value * -1,
    });

    this.amount.reset(0);
  }
}
