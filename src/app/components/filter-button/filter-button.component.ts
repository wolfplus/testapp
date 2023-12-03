import { Component, Input, OnInit } from '@angular/core';
import { FiltersPage } from 'src/app/modal/filters/filters.page';
import {ModalService} from '../../shared/services/modal.service';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent implements OnInit {
  @Input() clubId: string;
  filterIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="30" viewBox="0 0 26.7 30.3"><g transform="rotate(90 13.343 13.342)"><path transform="translate(4.458)translate(-169.01 -330.96)" d="m172.6 338a3.6 3.6 0 0 1-3.6-3.5 3.5 3.5 0 0 1 3.6-3.5 3.5 3.5 0 1 1 0 7zm0-5.3a1.7 1.7 0 1 0 1.8 1.7 1.7 1.7 0 0 0-1.8-1.7z"/><path transform="translate(0 2.496)translate(-166 -332.65)" d="m171.4 334.4h-4.5a0.9 0.9 0 1 1 0-1.8h4.5a0.9 0.9 0 1 1 0 1.8z"/><path transform="translate(9.807 2.496)translate(-172.63 -332.65)" d="m192.2 334.4h-18.7a0.9 0.9 0 1 1 0-1.8h18.7a0.9 0.9 0 1 1 0 1.8z"/><path transform="translate(20.505 9.806)translate(-179.86 -337.59)" d="m183.4 344.6a3.6 3.6 0 0 1-3.6-3.5 3.5 3.5 0 0 1 3.6-3.5 3.6 3.6 0 0 1 3.6 3.5 3.5 3.5 0 0 1-3.6 3.5zm0-5.2a1.7 1.7 0 1 0 1.8 1.7 1.7 1.7 0 0 0-1.8-1.7z"/><path transform="translate(0 12.362)translate(-166 -339.32)" d="m187.4 341.1h-20.5a0.9 0.9 0 1 1 0-1.8h20.5a0.9 0.9 0 1 1 0 1.8z"/><path transform="translate(25.854 12.362)translate(-183.47 -339.32)" d="m187 341.1h-2.7a0.9 0.9 0 1 1 0-1.8h2.7a0.9 0.9 0 1 1 0 1.8z"/><path transform="translate(9.152 19.672)translate(-172.19 -344.26)" d="m175.8 351.3a3.5 3.5 0 1 1 3.6-3.5 3.6 3.6 0 0 1-3.6 3.5zm0-5.2a1.7 1.7 0 1 0 1.8 1.7 1.8 1.8 0 0 0-1.8-1.7z"/><path transform="translate(0 22.227)translate(-166 -345.99)" d="m176 347.8h-9.2a0.9 0.9 0 1 1 0-1.8h9.2a0.9 0.9 0 0 1 0 1.8z"/><path transform="translate(14.502 22.227)translate(-175.8 -345.99)" d="m190.7 347.8h-14a0.9 0.9 0 0 1 0-1.8h14a0.9 0.9 0 1 1 0 1.8z"/></g></svg>';

  constructor(
      private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  openFilterModal() {
    this.modalService.filterSearchModal(FiltersPage, this.clubId);
  }
  closeFilterModal() {
    this.modalService.closeFilterClubModal();
  }
}
