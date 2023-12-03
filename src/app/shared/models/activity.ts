import { Icon } from './icon';

export interface Activity {
  "@id"?: string;
  "@type"?: string;
  id?: string;
  name?: string;
  types?: Array<string>;
  highlighted?: boolean;
  icon?: string;
  photo?: Icon;
  colors: Array<string>;
}
