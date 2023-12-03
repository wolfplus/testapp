import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from "../shared/services/environment/environment.service";
import {ModalController} from "@ionic/angular";
import {PlaygroundOptionDTO} from "../shared/models/playgroung-option";

@Component({
  selector: 'app-options-group-selection',
  templateUrl: './options-group-selection.component.html',
  styleUrls: ['./options-group-selection.component.scss']
})
export class OptionsGroupSelectionComponent implements OnInit {

  @Input() prestation: any;
  @Input() club: any;
  @Input() options: any;
  @Input() categories;
  @Input() countParticipant;
  @Input() from;
  catToReplace: string = null;
  canValidate = false;
  selectedOptions: Array<any> = [];
  modalCtrl: any;
  env: any;

  constructor(
      modalCtrl: ModalController,
      environmentService: EnvironmentService
  ) {
    this.env = environmentService.getEnvFile();
    this.modalCtrl = modalCtrl;
  }

  ngOnInit(): void {
    if (this.selectedCategories().length === 1) {
      this.catToReplace = this.categories[0].category["@id"];
    }
  }

  close() {
    this.modalCtrl.dismiss({success: false}).then();
  }

  validate() {
    this.modalCtrl.dismiss({options: this.selectedOptions, success: true, catToReplace: this.catToReplace}).then();
  }

  countOptionChanged(value) {
    this.selectedOptions.forEach((option: any) => {
      if (option.option === '/clubs/playgrounds/options/' + value.id) {
        option.quantity = parseInt(value['quantity'], 10);
      }
    });
  }
  optionChanged(value) {
    const optionIndexToChange = this.selectedOptions.findIndex(option => option.option === value);
    const optionChanged = this.options.find(option => option.id === value);
    if (optionIndexToChange === -1) {
      const optionToAdd: PlaygroundOptionDTO = {
        quantity: (optionChanged.minQuantity) ? optionChanged.minQuantity : undefined,
        option: optionChanged.option,
        price: optionChanged.price,
        label: optionChanged.label,
      };
      this.selectedOptions.push(optionToAdd);
    } else {
      this.selectedOptions.splice(optionIndexToChange, 1);
    }
  }

  selectedCategories() {
    let participantsList = [];
    this.countParticipant.forEach((key, value) => {
      if (key > 0) {
        const cat = this.categories.find(c => c.category['@id'] === value);
        participantsList.push({ label: cat.category.label, category: cat.category['@id'] });
      }
    });
    return participantsList;
  }

  manageUserPresence(value) {
    this.canValidate = true;
    this.catToReplace = value.catToReplace;
  }
}
