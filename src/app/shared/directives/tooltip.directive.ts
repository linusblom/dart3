import {
  Directive,
  TemplateRef,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';

import { TooltipComponent } from '@shared/components';
import { TooltipPosition } from '@shared/models';

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('tooltip') content: TemplateRef<any>;

  private _position = TooltipPosition.Bottom;
  @Input() set position(position: TooltipPosition) {
    this._position = position;

    switch (position) {
      case TooltipPosition.Right:
        this.positions = [
          { originX: 'end', overlayX: 'start', originY: 'center', overlayY: 'center' },
        ];
        break;
      default:
        this.positions = [
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
        ];
        break;
    }
  }

  overlayRef: OverlayRef;
  overlayInstance: TooltipComponent;
  positions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  ];

  private readonly destroy$ = new Subject();

  @HostListener('click')
  toggle() {
    if (this.overlayRef.hasAttached()) {
      this.close();
    } else {
      this.open();
    }
  }

  constructor(private readonly overlay: Overlay, private readonly elementRef: ElementRef) {}

  ngOnInit() {
    const overlayConfig = {
      hasBackdrop: true,
      backdropClass: 'backdrop',
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(this.positions),
    };

    this.overlayRef = this.overlay.create(overlayConfig);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  ngOnDestroy() {
    this.overlayInstance = null;
    this.overlayRef.dispose();
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  open() {
    const instance = this.overlayRef.attach(new ComponentPortal(TooltipComponent)).instance;
    instance.content = this.content;
    instance.position = this._position;
    instance.close.pipe(takeUntil(this.destroy$)).subscribe(() => this.close());
  }

  close() {
    this.overlayRef.detach();
  }
}
