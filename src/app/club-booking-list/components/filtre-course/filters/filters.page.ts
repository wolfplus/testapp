import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ModalController} from '@ionic/angular';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-filters-course',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersCoursePage implements OnInit {

  @Input() clubId: string;
  @Input() activities: any;
  @Input() filter: string;
  @Output() closeModal = new EventEmitter<void>();

  env;
  filterSections = [];
  filterSelected: any;
  skeletonShowSort: boolean;
  showActivitySkeleton: boolean;
  showSurfaceSkeleton: boolean;
  environments = [];

  constructor(
    public translate: TranslateService,
    private modalController: ModalController,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit() {
    this.activities.forEach(element => {
      if(this.filter !== null) {
        if(this.filter['id'] == element.id) {
          this.filterSections.push(true);
        } else {
          this.filterSections.push(false);
        }
      } else {
        this.filterSections.push(false);
      }
    });
  }

  selectFilter(i, activity) {
    this.filterSelected = activity;
    this.filterSections.forEach((_element, index) => {
      if(index == i) {
        if( this.filterSections[index] == true) {
          this.filterSections[index] = false;
          this.filterSelected = null;
        } else {
          this.filterSections[index] = true;
        }
      } else {
        this.filterSections[index] = false;
      }
    });
  }

  apply() {
    if(this.filterSelected != null) {
      this.modalController.dismiss({filter: this.filterSelected});
    } else {
      this.modalController.dismiss({filter: null});
    }
  }

  close() {
    this.modalController.dismiss();
  }

}
