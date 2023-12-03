import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SearchType } from 'src/app/shared/enums/search-type';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() from: SearchType;
  @Output() filtersChange = new EventEmitter();
  env;
  constructor(
      private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit() {}

  changeInputSearch() {
    this.filtersChange.emit();
  }
}
