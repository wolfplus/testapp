import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-shop-gift-form',
  templateUrl: './shop-gift-form.component.html',
  styleUrls: ['./shop-gift-form.component.scss']
})
export class ShopGiftFormComponent implements OnInit {

  errors: any;

  formData: any = [{ required: true, field: { name: 'firstName', type: 'text', label: 'Prénom'}},
    { required: true, field: { name: 'lastName', type: 'text', label: 'Nom'}},
    { required: true, field: { name: 'phoneNumber', type: 'phone', label: 'Téléphone Portable'}},
    { required: true, field: { name: 'email', type: 'text', label: 'Email'}}];
  form: any;

  constructor(private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.generateForm();
  }

  changeInput(data) {
    this.form[data.name] = data.value;
    this.validForm();
  }

  dismiss() {
    this.modalController.dismiss({success: false, customData: null});
  }

  generateForm() {
    let initialValue = {};
    let initialValueErrors = {};
    initialValue = this.formData.reduce((obj, item) => {
      return {
        ...obj,
        [item?.field.name]: null,
      };
    }, initialValue)

    initialValueErrors = this.formData.reduce((obj, item) => {
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
    this.formData.forEach(element => {
      if (element.required) {
        if (element.field.name === 'phoneNumber') {
          if (String(this.form[element.field.name]).match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g) !== null && this.form[element.field.name].length === 12) {
            this.errors[element.field.name] = false;
          } else {
            this.errors[element.field.name] = true;
            isValid = false;
          }
        }
        if (element.field.name !== 'phoneNumber' && element.field.name !== 'email') {
          if (
              this.form[element.field.name] &&
              this.form[element.field.name] !== '' &&
              this.form[element.field.name] !== undefined) {
            this.errors[element.field.name] = false;
          } else {
            this.errors[element.field.name] = true;
            isValid = false;
          }
        }
        if (element.field.name === 'email') {
          if (String(this.form[element.field.name]).match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null) {
            this.errors[element.field.name] = false;
          } else {
            this.errors[element.field.name] = true;
            isValid = false;
          }
        }
      }
    });

    if (isValid && send) {
      this.modalController.dismiss({success: true, customData: this.form}).then()
    }
  }
}
