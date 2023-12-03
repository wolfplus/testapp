import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.css']
})
export class HeaderActionsComponent {

  @Input() isFavoris = false;
  @Input() isShare = false;
  @Input() isPreferred = false;
  @Input() deepLink: string;
  @Input() shareMessage: string;
  @Input() shareSubject: string;
  @Output() readonly closeEvent = new EventEmitter<any>();
  @Output() readonly share = new EventEmitter<any>();
  @Output() readonly preferred = new EventEmitter<any>();

  constructor(
    private socialSharing: SocialSharing
  ) { }

  closeAction() {
    this.closeEvent.emit();
  }

  changePreferred() {
    this.preferred.emit();
  }

  shareAction() {
    this.socialSharing.shareWithOptions({
      message: this.shareMessage,
      subject: this.shareSubject,
      url: this.deepLink
    }).then(() => {
      // Sharing via email is possible
    }).catch(() => {
      // Sharing via email is not possible
    });
  }

}
