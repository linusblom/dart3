import {
  Component,
  Input,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { TooltipPosition } from '@shared/models';

@Component({
  selector: 'app-tooltip',
  template: '<ng-container #content></ng-container>',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentRef: ViewContainerRef;

  @Input() content: TemplateRef<any>;

  @Output() close = new EventEmitter<void>();

  @Input() @HostBinding('class') position = TooltipPosition.Bottom;

  @HostListener('click', ['$event.target'])
  click(target: HTMLElement) {
    if (target.closest('.close-tooltip:not([disabled])')) {
      this.close.emit();
    }
  }

  ngOnInit() {
    this.contentRef.createEmbeddedView(this.content);
  }
}
