import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.scss']
})
export class FriendCardComponent implements OnInit {

  // @Input() friend: Friend;
  // TODO: FIX Type error for Friend
  @Input() friend: any;
  @Input() disabled: boolean;
  @Input() isSelected: boolean;
  @Output() selected = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() remove = new EventEmitter();
  pathUrl: string;
  constructor(
    private environmentService: EnvironmentService
  ) {
    this.pathUrl = this.environmentService.getEnvFile().pathFiles;
  }

  ngOnInit(): void {}

  changeSelected(element) {
    if (element.checked) {
      this.add.emit(this.friend);
    } else {
      this.remove.emit(this.friend);
    }
  }
}
