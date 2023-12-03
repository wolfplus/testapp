import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClubActions } from '../../store/actions';
import { ClubState } from '../../store/club.reducers';

export enum NavigationDirection {
  FROM_LEFT = "fromLeft",
  FROM_RIGHT = "fromRight",
  TO_LEFT = "toLeft",
  TO_RIGHT = "toRight"
}

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent implements OnInit, AfterViewInit {
  @ViewChild("underliner", {static: false}) underliner: ElementRef;
  @ViewChild("listContainer", {static: false}) listContainer: ElementRef;
  @ViewChild("listContainerUl", {static: false}) listContainerUl: ElementRef;
  @ViewChild("underlinerContainer", {static: false}) underlinerContainer: ElementRef;

  @Input() clubLinks: Array<any>;
  linksWidth: string;

  activeSection: {name: string, index: number};
  activeSectionIndex: number;

  // TODO teest toDirection:
  toDirection: string;

  constructor(private store: Store<ClubState>) { }

  ngOnInit() {
    // TODO: change implementation
    // Add translation
    this.clubLinks = [
      /* TODO: put back first link as selected */
      {name: "infos", selected: true},
      {name: "my_club", selected: false},
      {name: "matches", selected: false},
      {name: "shop", selected: false}
    ];

    this.activeSection = this.clubLinks[0];
    this.activeSectionIndex = 0;
  }

  ngAfterViewInit() {
    // TODO: fix it;
    this.underlinerContainer.nativeElement.style.width = this.listContainerUl.nativeElement.style.width;
    this.underliner.nativeElement.style.width = 100 / this.clubLinks.length + "%";
  }

  onLinkClicked(link, index) {
    this.clubLinks.map( clubLink => {
      clubLink.selected = false;
      this.clubLinks[index].selected = true;
    });

    // const scrollWidth = this.underliner.nativeElement.scrollWidth;
    // const clientWidth = this.listContainerUl.nativeElement.clientWidth;

    // this.underliner.nativeElement.style.left = ((clientWidth /this.clubLinks.length) * index) + "px";
    this.underliner.nativeElement.style.left = ((100 / this.clubLinks.length) * index) + "%";

    this.store.dispatch(ClubActions.updateNavDirections({navTo: this.getDirectionTo(index)}));

    setTimeout( _ => {
      this.store.dispatch(ClubActions.navToClubSection(
        {
          sectionName: link.name,
          sectionIndex: index
        }));
      this.activeSection = link;
      this.activeSectionIndex = index;
    }, 100);
  }

  getDirectionTo(index): string {
    let nextDirection: string;
    if (this.activeSectionIndex > index) {
      nextDirection = NavigationDirection.TO_LEFT;
    } else if (this.activeSectionIndex < index) {
      nextDirection = NavigationDirection.TO_RIGHT;
    }
    return nextDirection;
  }

  getDirectionFrom(index) {
    let fromDirection: string;
    if (this.activeSectionIndex > index) {
      fromDirection = NavigationDirection.FROM_RIGHT;
    } else {
      fromDirection = NavigationDirection.FROM_LEFT;
    }
    return fromDirection;
  }

}
