import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-svg-container',
  templateUrl: './svg-container.component.html',
  styleUrls: ['./svg-container.component.scss']
})
export class SvgContainerComponent implements AfterViewInit {
  @ViewChild('svgContainer') svgContainer: ElementRef;
  @Input() svg: string;
  @Input() inputClass: string;
  @Input() iconColor: string;
  constructor() { }

  ngAfterViewInit() {
    this.svgContainer.nativeElement.innerHTML = this.svg;
  }
}
