import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[participantsInfoColor]'
})
export class ParticipantsInfoColorDirective implements OnInit{

  @Input() participantsCount!: number;
  @Input() maxParticipantsCountLimit!: number;
  
  constructor(private renderer:Renderer2, private element:ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    if (this.maxParticipantsCountLimit === 0) {
      this.renderer.setStyle(this.element.nativeElement, 'color', '#fc322d')
      return;
    }

    const percent = (this.participantsCount * 100 ) / this.maxParticipantsCountLimit;

    if (percent < 50) {
      this.renderer.setStyle(this.element.nativeElement, 'color', '#0ac427')
    } else if (percent > 75) {
      this.renderer.setStyle(this.element.nativeElement, 'color', '#fc322d')
    } else {
      this.renderer.setStyle(this.element.nativeElement, 'color', 'orange')
    }
  }
}
