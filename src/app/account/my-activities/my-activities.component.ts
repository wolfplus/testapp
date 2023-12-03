import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Activity } from '../../shared/models/activity';
import { LevelService } from '../../shared/services/level/level.service';
import { UserService } from '../../shared/services/storage/user.service';

import { ActivityService } from '../../shared/services/activity/activity.service';
import { ActivityLevel } from '../../shared/models/activity-level';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.scss']
})
export class MyActivitiesComponent implements OnInit {

  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  data: Array<any>;
  dataLevels: Array<any>;
  view: string;
  searchActivity: string;
  activities: Array<Activity>;
  selectedActivity: Activity;
  selectedLevel: ActivityLevel;
  selectedRank: string;
  choiceLevels: Array<ActivityLevel>;
  updateLevel: any;
  isLoaded = false;

  constructor(
    private levelService: LevelService,
    private userService: UserService,
    private activityService: ActivityService,
    private modalCtrl: ModalController,
    private environmentService: EnvironmentService
  ) {
    this.view = 'list';
    this.choiceLevels = [];
    this.selectedRank = null;
    this.selectedLevel = {
      id: null
    };
  }

  ngOnInit(): void {
    this.getLevel();
    this.activityService.getActivities()
      .subscribe(data => {
        if (data) {
          this.activities = data['hydra:member'];
        }
        this.activities.forEach((element, index) => {
          if (this.data) {
            this.data.forEach((element2) => {
              if(element['@id'] == element2.activity['@id']) {
                this.activities.splice(index, 1);
              }
            });
          }
          this.isLoaded = true;
        })
      });
  }

  addActivity() {
    this.selectedActivity = null;
    this.view = 'choices_activity';
  }

  getLevel() {
    this.levelService.get().subscribe(data => {
      if (data) {
        this.data = data['hydra:member'];
      }
    });
  }

  setGradient(colors) {
    return {
      background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
      'background-repeat': 'no-repeat',
      opacity: '.8'
    };
  }

  selectActivity(activity) {
    this.view = 'choices_level';
    this.selectedRank = null;
    this.selectedLevel = {
      id: null
    };
    this.selectedActivity = activity;
    this.levelService.getActivityLevels(activity['@id'].replace('/activities/', '')).subscribe(data => {
      if (data) {
        this.choiceLevels = data;
      }
    });
  }

  selectLevel(level) {
    this.selectedLevel = level;
    this.selectedRank = null;
  }

  selectRank(rank) {
    this.selectedRank = rank;
  }

  updateActivity(item) {
    this.updateLevel = item;
    this.selectedActivity = item.activity;
    this.selectedLevel = item.activityLevels;
    this.selectedRank = item.activityLevels.rank;
    this.selectActivity(item.activity);
  }

  confirmActivityLevel() {
    this.userService.get().subscribe(user => {
      const data = {
        user: user['@id'],
        activity: this.selectedActivity['@id'],
        activityLevels: [this.selectedLevel['@id']],
        rank: this.selectedRank
      };
      if (!this.updateLevel) {
        this.levelService.addUserLevel(data).subscribe(() => {
          this.getLevel();
          this.updateLevel = null;
          this.selectedActivity = null;
          this.selectedLevel = null;
          this.selectedRank = null;
          this.choiceLevels = [];
          this.view = 'list';
        });
      } else {
        this.levelService.updUserLevel(this.updateLevel['@id'], data).subscribe(() => {
          this.getLevel();
          this.updateLevel = null;
          this.selectedActivity = null;
          this.selectedLevel = null;
          this.selectedRank = null;
          this.choiceLevels = [];
          this.view = 'list';
        });
      }
    });
  }

  close() {
    // this.navCtrl.back();
    this.modalCtrl.dismiss({refresh: true});
  }
}
