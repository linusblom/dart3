import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Invoice } from 'dart3-sdk';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceComponent {
  @Input() invoices: Invoice[] = [];

  @Output() pay = new EventEmitter<Invoice>();

  overdue(dueDate: Date) {
    return new Date(dueDate).getTime() < Date.now();
  }
}
