import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import {TranslateService} from '@ngx-translate/core';
import * as FilterActions from '../../state/actions/filter.actions';
import {ModalController} from '@ionic/angular';
import {Filter, FilterCategory, FilterKey} from '../../shared/models/filter';
import {map, tap } from 'rxjs/operators';
import {ActivityService} from '../../shared/services/activity/activity.service';
import {Observable, Subscription} from 'rxjs';

import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {ClubState} from "../../club/store/club.reducers";
import {getCurrentClub} from "../../club/store";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit, OnDestroy {
  @Input() filtersCategory = FilterCategory.ALL;
  @Input() clubId: string;
  @Output() closeModal = new EventEmitter<void>();

  env;
  FilterKey = FilterKey;

  skeletonShowSort: boolean;
  showActivitySkeleton: boolean;
  showSurfaceSkeleton: boolean;
  sorters: Array<any>;
  activities$: Observable<any>;
  surfaces$: Observable<any>;
  environments = [];
  distanceFilterValue: number;
  storeFilters: Array<any>;
  storeFiltersSubscription$: Subscription;
  filterSelection = [];
  filterSelectionInitialized = false;

  firstChange = true;

  constructor(
      private store: Store<AppState>,
      private storeClub: Store<ClubState>,
    public translate: TranslateService,
    private activityService: ActivityService,
    private modalController: ModalController,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.skeletonShowSort = true;
    this.showActivitySkeleton = true;
    this.showSurfaceSkeleton = true;
    this.sorters = [
      {
        translate: 'sort_by.distance',
        type: 'SORT',
        value: 'distance'
      },
      {
        translate: 'sort_by.name',
        type: 'SORT',
        value: 'name'
      }
    ];
    this.storeClub.select(getCurrentClub).pipe(tap(club => {
      this.environments = [];
      if (club.environments) {
        if (club.environments.indoor) {
          this.environments.push({
            name: this.translate.instant('label.surface.indoor'),
            id: 'indoor'
          });
        }
        if (club.environments.outdoor) {
          this.environments.push({
            name: this.translate.instant('label.surface.outdoor'),
            id: 'outdoor'
          });
        }
      } else {
        this.environments = [
          {
            name: this.translate.instant('label.surface.indoor'),
            id: 'indoor'
          },
          {
            name: this.translate.instant('label.surface.outdoor'),
            id: 'outdoor'
          },
        ];
      }
    })).subscribe();
  }

  ngOnInit() {
    this.activities$ = this.activityService.getActivities(this.clubId).pipe(
        map(activities =>  activities['hydra:member']),
        tap( () => {
          this.showActivitySkeleton = false;
        })
    );

    this.surfaces$ = this.activityService.getSurfaces(this.clubId).pipe(
        map( surfaces => surfaces['hydra:member']),
        tap( () => {
          this.showSurfaceSkeleton = false;
        })
    );

    this.storeFiltersSubscription$ = this.store.select('filter')
        .subscribe( filters => {
          this.storeFilters = filters;
          if (this.filterSelectionInitialized === false ) {
            this.filterSelection = [...this.storeFilters];
            this.filterSelectionInitialized = true;
          }
        });

    this.getDistanceVal();
  }

  isSelected(id: string): boolean {
    let bool = false;
    if (this.filterSelection.find(filter => filter.value === id)) {
      bool = true;
    }
    return bool;
  }

  ngOnDestroy() {
    this.storeFiltersSubscription$.unsubscribe();
  }

  // TODO: ADD SORTERS
  sorterClicked(sorter, index) {
    if (this.sorterIsSelected(sorter.value)) {
      this.clickRemoveSort(index);
    } else {
      this.addSorter(sorter.value);
    }
  }

  addSorter(value: string) {
    const data: Filter = {
      label: this.translate.instant('sort_by.' + value),
      keyFilter: FilterKey.SORT,
      category: this.filtersCategory,
      value: '' + value
    };
    this.store.dispatch(new FilterActions.Addfilter(data));
  }

  sorterIsSelected(value: string) {
    let bool = false;

    this.storeFilters.forEach(item => {
      if (item.keyFilter === 'SORT' && value === item.value) {
        bool = true;
      }
    });

    return bool;
  }

  clickRemoveSort(_indexInSortFilters) {
    // this.store.dispatch(new FilterActions.RemoveFilter(indexInSortFilters));
  }

  clickFilter(key, element) {
    let clickedFilter: Filter;
    let filterThatIsInSelection: Filter;
    if (key !== FilterKey.DISTANCE) {
      clickedFilter = {
        label: element.name,
        keyFilter: key,
        category: this.filtersCategory,
        value: element.id
      };
      filterThatIsInSelection = this.filterSelection.find(filter => filter.value === clickedFilter.value);
    } else {
      clickedFilter = {
        label: this.distanceFilterValue + 'km',
        keyFilter: key,
        category: this.filtersCategory,
        value: '' + this.distanceFilterValue,
      };
      filterThatIsInSelection = this.filterSelection.find(filter => filter.keyFilter === clickedFilter.keyFilter);
    }

    const catFilterThatIsAlreadyInSelection = this.filterSelection.find(filter => filter.keyFilter === clickedFilter.keyFilter);

    // Can't have Both environment filters selected
    // If one already is added and you add a second one you have to remove both
    if (key === FilterKey.ENVIRONMENT || key === FilterKey.DISTANCE || key === FilterKey.ACTIVITY) {
      this.filterSelection.find(filter => filter.keyFilter === clickedFilter.keyFilter);
      // If there's not already any environment filter in the selection
      if (!catFilterThatIsAlreadyInSelection) {
        this.filterSelection.push(clickedFilter);
      } else {
        // If there's already an environment filter in the selection
        // Remove the env filter already in selection...
        this.filterSelection
            .splice(this.filterSelection.indexOf(catFilterThatIsAlreadyInSelection), 1);
        // ... and add the selected one only if it's not the one in the selection
        if (clickedFilter.value !== catFilterThatIsAlreadyInSelection.value) {
          this.filterSelection.push(clickedFilter);
        }
      }

    } else { // If !(key === FilterKey.ENVIRONMENT || key === FilterKey.DISTANCE)
      if (filterThatIsInSelection === undefined) {
        this.filterSelection.push(clickedFilter);
      } else {
        this.filterSelection
            .splice(this.filterSelection.indexOf(filterThatIsInSelection), 1);
      }
    }
  }

  changeFilterDistance() {
    if (this.firstChange === false) {
      this.clickFilter(FilterKey.DISTANCE, this.distanceFilterValue);
    }
    this.firstChange = false;
  }

  getDistanceVal() {
    const storedDistance = this.storeFilters.find( filter => filter.keyFilter === FilterKey.DISTANCE);
    if (storedDistance !== undefined) {
      this.distanceFilterValue = parseInt(storedDistance.value, 0);
    } else {
      this.distanceFilterValue = 20;
    }
  }

  applyFilters() {
    for (const property of Object.values(FilterKey)) {
      this.store.dispatch(new FilterActions.RemoveFilterByKeyFilter(property.toString()));
    }
    this.filterSelection.forEach( filter => this.store.dispatch(new FilterActions.Addfilter(filter)));

    this.close();
  }

  close() {
    this.modalController.dismiss();
  }

}
