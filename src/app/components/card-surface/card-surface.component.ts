import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-surface',
  templateUrl: './card-surface.component.html',
  styleUrls: ['./card-surface.component.scss'],
})
export class CardSurfaceComponent implements OnInit {

  @Input() title: string;
  @Input() guid: string;
  @Input() isSelected: boolean = false;

  constructor(
  ) { }

  ngOnInit() {}

}
