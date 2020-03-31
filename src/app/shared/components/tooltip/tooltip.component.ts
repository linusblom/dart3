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
} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  template: '<ng-container #content></ng-container>',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentRef: ViewContainerRef;

  @Input() content: TemplateRef<any>;
  @Output() close = new EventEmitter<void>();

  @HostListener('click', ['$event.target'])
  click(target: HTMLElement) {
    if (target.closest('.close-tooltip')) {
      this.close.emit();
    }
  }

  ngOnInit() {
    this.contentRef.createEmbeddedView(this.content);
  }
}
