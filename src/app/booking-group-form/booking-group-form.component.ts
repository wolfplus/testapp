import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from "../shared/services/environment/environment.service";
import {PriceCalculatorService} from "../shared/services/price/price-calculator.service";
import {tap} from "rxjs/operators";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-booking-group-form',
  templateUrl: './booking-group-form.component.html',
  styleUrls: ['./booking-group-form.component.scss']
})
export class BookingGroupFormComponent implements OnInit {
  @Input() prestation: any;
  @Input() blockPriceId: string;
  @Input() club: any;
  @Input() options: any;
  @Input() categories: any;
  @Input() countParticipant: any;
  @Input() option: any;
  @Input() slot: any;
  @Input() formulaParticipant: any;
  form: any;
  env: any;
  ready = false;
  blockPrice: any;
  errors: any;

  constructor(
      private envService: EnvironmentService,
      private priceService: PriceCalculatorService,
      private modalCtr: ModalController
  ) {
    this.env = this.envService.getEnvFile();
  }

  ngOnInit(): void {
    this.blockPrice = this.prestation;
    this.load();
  }

  load() {
    this.priceService.getFormBlockPrice((this.prestation.form['@id']? this.prestation.form['@id'] : this.prestation.form))
        .pipe(tap(data => {
          if (data) {
            this.blockPrice.form = data;
            this.prestation.form = data;
            this.generateForm();
            this.ready = true;
          }
        }))
        .subscribe()
  }

  changeInput(data) {
    this.form[data.name] = data.value;
    this.validForm();
  }

  generateForm() {
    let initialValue = {};
    let initialValueErrors = {};
    initialValue = this.blockPrice.form.fields.reduce((obj, item) => {
      return {
        ...obj,
        [item?.field.name]: null,
      };
    }, initialValue);

    initialValueErrors = this.blockPrice.form.fields.reduce((obj, item) => {
      return {
        ...obj,
        [item?.field.name]: false,
      };
    }, initialValueErrors);

    this.form = initialValue;
    this.errors = initialValueErrors;
  }

  validForm(send = false) {
    let isValid = true;
    this.blockPrice.form.fields.forEach(element => {
      if (element.required) {
        if (this.form[element.field.name] &&  this.form[element.field.name] !== '' &&  this.form[element.field.name] !== undefined) {
          this.errors[element.field.name] = false;
        } else {
          this.errors[element.field.name] = true;
          isValid = false;
        }
      }
    });

    if (isValid && send) {
      this.modalCtr.dismiss({success: true, customData: this.form}).then()
    }
  }

  close() {
    this.modalCtr.dismiss({success: false}).then();
  }
}
