import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { getPrimaryColor } from '../../../utils/get-primary-color';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';

@Component({
  selector: 'app-avatar-name-tablet',
  templateUrl: './avatar-name-tablet.component.html',
  styleUrls: ['./avatar-name-tablet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarNameTabletComponent implements OnInit, AfterViewInit {
  @Input() imageUrl: string;
  @Input() imageSize: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() fontSizes = FontSize.SMALL;
  @Input() colorStyle: ColorStyle;
  @Input() organizerName: string;

  titleToDisplay: string;
  baseUrl = this.environmentService.getEnvFile().domainAPI;
  FontSize = FontSize;
  ColorStyle = ColorStyle;
  nameForAvatar: string;
  avatarBgColor = 'lightGray';

  constructor(
    private translateService: TranslateService,
    private environmentService: EnvironmentService
  ) { }

  ngOnInit() {

    this.titleToDisplay = this.title;
    if (this.title !== 'invited') {
      this.nameForAvatar = this.title;
    } else if (this.organizerName !== undefined) {
      this.nameForAvatar = this.organizerName;
    }

    this.nameForAvatar = this.title;
    this.avatarBgColor = getPrimaryColor();

    if (this.imageUrl === undefined && this.title === 'invited') {
      if (this.organizerName !== undefined) {
        this.nameForAvatar = this.organizerName;
      } else {
        if (this.subtitle !== undefined) {
          this.nameForAvatar = this.subtitle;
        }
      }
    } else if (this.imageUrl === undefined && this.title !== 'invited') {
      this.nameForAvatar = this.title;
    }

    if (this.title === 'invited') {
      this.translateService.get(this.title)
        .subscribe( translatedTitle => {
          this.titleToDisplay = translatedTitle;
        });
    } else {
      this.titleToDisplay = this.title;
    }

  }

  ngAfterViewInit() {

  }

}
