import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {
  @Input() title$: Observable<string>;
  @Input() subtitle$: Observable<string>;
  @Output() backButtonClicked = new EventEmitter<any>();

  constructor(
  ) {
    // TODO: check if it works with emulator. If so implement it everywhere needed
    /* this.platform.backButton.subscribeWithPriority(101, async () => {
      this.back();
    }); */
  }

  ngOnInit() {}

  back() {
    this.backButtonClicked.emit();
  }

}
