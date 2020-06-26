import { Component, Input } from '@angular/core';
import { Transaction } from 'dart3-sdk';

@Component({
  selector: 'app-player-transactions',
  templateUrl: './player-transactions.component.html',
  styleUrls: ['./player-transactions.component.scss'],
})
export class PlayerTransactionsComponent {
  @Input() transactions: Transaction[] = [];
}
