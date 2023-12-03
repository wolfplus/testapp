import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() totalItems: number;
  @Input() showCart = false;
  @Input() isPage = false;

  @Output() backButtonAction = new EventEmitter<any>();
  @Output() cartButtonAction = new EventEmitter<any>();

  constructor(
      private toast: ToastService
  ) { }

  back() {
    this.backButtonAction.emit();
  }

  goToCart() {
    if (this.totalItems > 0) {
      this.cartButtonAction.emit();
    } else {
      this.toast.presentInfo("cart_empty_action");
    }
  }
}
