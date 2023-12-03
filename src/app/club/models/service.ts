import { SafeResourceUrl } from '@angular/platform-browser';

export interface Service {
  id: string;
  name: string;
  icon: any | SafeResourceUrl;
}
