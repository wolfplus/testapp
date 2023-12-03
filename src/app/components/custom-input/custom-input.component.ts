import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import intlTelInput from 'intl-tel-input';
import {EnvironmentService} from "../../shared/services/environment/environment.service";

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent implements OnInit, AfterViewInit {

  @Input() show = true;
  @Input() name = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() label = '';
  @Input() type = '';
  @Input() textarea = false;
  @Input() placeholder = '';
  @Input() model = '';
  @Input() error = false;
  @Output() onClick = new EventEmitter();
  @Output() onChange = new EventEmitter();

  phoneCode: number;

  iti: any;

  env: any;

  constructor(private environmentService: EnvironmentService) {
  }

  ngOnInit(): void {
    this.env = this.environmentService.getEnvFile();
  }

  ngAfterViewInit() {
    if (this.type === 'phone') {
      const input = document.querySelector("#phone");
      this.iti = intlTelInput(input, {
        // any initialisation options go here
        utilsScript: "src/utils/utils.js",
        initialCountry: this.env.defaultPhoneLang,
        onlyCountries: ['ae', 'be', 'ch', 'ci', 'de', 'es', 'fr', 'gb', 'gp', 'it', 'lu', 'mq', 'nl', 'pt', 're', 'sn', 'mu', 'gf', 'th', 'se', 'mc', 'ma', 'nc', 'mg', 'dz', 'pl']
      });
    }
  }

  click() {
    this.onClick.emit({name: this.name, value: this.model});
  }

  change() {
    if (this.iti && this.type === 'phone') {
      this.model = this.iti.getNumber();
    }
    this.onChange.emit({name: this.name, value: this.model});
  }

  confirmPhoneCode(code) {
    this.phoneCode = code;
  }
}
