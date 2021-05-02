import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from 'dart3-sdk';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() set pagination({ total, offset, limit }: Omit<Pagination<any>, 'items'>) {
    this.limit = limit;
    this.totalPages = Math.ceil(total / this.limit);
    this.currentPage = Math.ceil(offset / limit + 1);
    this.pages = this.getPages();
  }

  @Output() changeOffset = new EventEmitter<number>();

  currentPage = 1;
  totalPages = 1;
  limit = 10;
  pages: (string | number)[] = [];

  getPages() {
    if (this.totalPages < 10) {
      return Array(this.totalPages)
        .fill(1)
        .map((p, i) => p + i);
    }

    const pages = Array(5)
      .fill(this.currentPage - 2)
      .map((p, i) => p + i)
      .filter((p) => p >= 1 && p <= this.totalPages);

    if (this.currentPage > 5) {
      pages.unshift(1, '...');
    } else if (this.currentPage > 4) {
      pages.unshift(1, 2);
    } else if (this.currentPage > 3) {
      pages.unshift(1);
    }

    if (this.currentPage < this.totalPages - 4) {
      pages.push('...', this.totalPages);
    } else if (this.currentPage < this.totalPages - 3) {
      pages.push(this.totalPages - 1, this.totalPages);
    } else if (this.currentPage < this.totalPages - 2) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  changePage(page: number) {
    this.currentPage = page;
    this.changeOffset.emit((page - 1) * this.limit);
  }
}
