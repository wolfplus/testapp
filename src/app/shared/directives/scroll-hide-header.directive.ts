import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { DomController, IonContent } from '@ionic/angular';

@Directive({
    selector: '[appScrollHideHeader]'
})
export class ScrollHideHeaderDirective implements AfterViewInit, OnChanges {

  @Input() scrollContent: IonContent;
  contentIsLoaded: boolean;

  contentHeight: number;
  scrollHeight: number;
  firstElementHeight: number;
  secondElementHeight: number;
  lastScrollPosition: number;
  lastValue = 0;
  maxValue: number;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {

    if (this.scrollContent) {
        this.scrollContent.ionScrollStart
          .subscribe(() => {
            this.firstElementHeight = this.element.nativeElement.firstElementChild.clientHeight;
            this.secondElementHeight = this.element.nativeElement.children[1].clientHeight;
            const totalHeight = this.firstElementHeight + this.secondElementHeight;
            this.maxValue = Math.floor(totalHeight);
            // element.children[0].children[0].children[0].children[0].children;

            this.scrollContent.getScrollElement().then( el => this.contentHeight = el.offsetHeight);
            this.scrollContent.getScrollElement().then( el => this.scrollHeight = el.scrollHeight);
          });

        this.scrollContent.ionScroll.subscribe((ev) => this.adjustElementOnScroll(ev));
        this.scrollContent.ionScrollEnd.subscribe((ev) => this.adjustElementOnScroll(ev));
    }
  }

  private adjustElementOnScroll(ev) {
    if (ev) {
      this.domCtrl.write(async () => {
        const el = await this.scrollContent.getScrollElement();
        const scrollTop: number = el.scrollTop > 0 ? el.scrollTop : 0;
        this.setElementStyle(scrollTop);
      });
    }
  }

  setElementStyle(scrollTop) {
    if (scrollTop > 0) {
      this.renderer.setStyle(this.element.nativeElement, 'margin-top', `-${this.maxValue}px`);
    } else {
      this.renderer.setStyle(this.element.nativeElement, 'margin-top', '0px');
    }
  }

}

export interface ScrollHideConfig {
  cssProperty: string;
  maxValue: number;
}
