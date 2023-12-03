import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {IonRadioGroup} from "@ionic/angular";

@Component({
  selector: 'app-manage-participants-group-booking',
  templateUrl: './manage-participants-group-booking.component.html',
  styleUrls: ['./manage-participants-group-booking.component.scss']
})
export class ManageParticipantsGroupBookingComponent {

  @ViewChild('radioGroup') radioGroup: IonRadioGroup;

  @Input() categories;
  @Input() countParticipant;
  @Input() participantsList: Array<any>;
  @Output() manageUserPresence = new EventEmitter<{ isUserPresent: boolean, catToReplace: string }>();
  userToReplace: any = null;

  onChange(value) {
    this.radioGroup.value = value;
    this.participantsList.forEach(part => {
      if (part.label === value) {
        this.userToReplace = part;
        this.manageUserPresence.emit({isUserPresent: true, catToReplace: this.userToReplace.category});
      }
    });
  }
}
