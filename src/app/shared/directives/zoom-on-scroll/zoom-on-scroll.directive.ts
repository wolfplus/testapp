import { AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appZoomOnScroll]',
})
export class ZoomOnScrollDirective implements OnInit, AfterViewInit {
  @Input() scrollContent: ElementRef;

  eventOptions: boolean|{capture?: boolean, passive?: boolean};
  scrollWidth: number;
  offsetLeft: number;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }

  ngOnInit() {

    this.eventOptions = true;

    /* this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.adjustElementOnScroll.bind(this), this.eventOptions);
    }); */

  }

  ngAfterViewInit() {
    setTimeout( _ => {
    }, 500);
  }

  adjustElementOnScroll(ev) {
    const that = this;
    if (ev) {
      const elementOffsetLeft = this.element.nativeElement.offsetLeft;
      const elementWidth = this.element.nativeElement.clientWidth;
      const parentElWidth = this.element.nativeElement.parentElement.clientWidth;

      const triggerXStart = ((elementWidth + 10) / 2);
      const triggerXEnd = parentElWidth - ((elementWidth + 10) / 2);

      that.domCtrl.write( () => {
        setTimeout( _ => {
          that.setElementStyle(elementOffsetLeft, triggerXStart, triggerXEnd);
        }, 500);
      });
    }
  }

  setElementStyle(elementOffsetLeft, triggerXStart, triggerXEnd) {
    if (elementOffsetLeft >= triggerXStart && elementOffsetLeft <= triggerXEnd) {
      this.renderer.setStyle(this.element.nativeElement.children[0], 'width', `70vw`);
      // this.renderer.setStyle(this.element.nativeElement.children[0], 'scroll-snap-type', 'x mandatory');
    } else {
      this.renderer.setStyle(this.element.nativeElement.children[0], 'width', '60vw');
    }
  }

  scrolling() {
  }

}
