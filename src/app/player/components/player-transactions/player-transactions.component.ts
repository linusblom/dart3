import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination, Transaction } from 'dart3-sdk';

@Component({
  selector: 'app-player-transactions',
  templateUrl: './player-transactions.component.html',
  styleUrls: ['./player-transactions.component.scss'],
})
export class PlayerTransactionsComponent {
  @Input() transactions: Pagination<Transaction>;
  @Output() changeOffset = new EventEmitter<number>();
}
