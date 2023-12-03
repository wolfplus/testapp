export interface UserClient {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatar?: { contentUrl: string};
  phoneNumber?: string;
  shortcutLastName?: string;
}

export interface AccessCode {
  accessCode: string;
}