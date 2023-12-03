import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { PlaygroundOption } from 'src/app/shared/models/playgroung-option';
import { Subscription } from 'rxjs';
import { ClubState } from 'src/app/club/store/club.reducers';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { getClubCurrency } from 'src/app/club/store';

@Component({
  selector: 'app-select-playground-options',
  templateUrl: './select-playground-options.component.html',
  styleUrls: ['./select-playground-options.component.scss'],
})
export class SelectPlaygroundOptionsComponent implements OnChanges {

  @Input() options: Array<PlaygroundOption>;
  @Input() currency: string;
  @Output() optionChanged = new EventEmitter<void>();
  @Output() countOptionChanged = new EventEmitter<any>();

  isLoaded = false;

  clubCurrencySub: Subscription;
  clubCurrency: string;

  model = [];

  select: Array<number>;

  constructor(
    private clubStore: Store<ClubState>
  ) { }

  ngOnInit() {
    this.clubCurrencySub = this.clubStore.pipe(
      select(getClubCurrency),
      tap(currency => this.clubCurrency = currency)
    ).subscribe(
      () => {
        this.isLoaded = true;
      }
    );
  }

  getQuantityArray(min, max) {
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }

  ngOnChanges() {
    if (this.options) {
      this.options.forEach(option => {
        this.model.push({ value: option.id, isChecked: false });
      });
    }
  }

  onCheckBoxChange(id) {
    this.optionChanged.emit(id);
  }

  onLabelClick(id, index) {
    this.optionChanged.emit(id);
    this.model[index].isChecked = !this.model[index].isChecked;
  }

  onSelectChange(event, id) {
    this.countOptionChanged.emit({ id, quantity: event.detail.value });
  }
}
