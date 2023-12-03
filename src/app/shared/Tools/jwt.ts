export interface CustomToken {
    iat: number;
    exp: number,
    roles: Array<string>;
    username: string;
    id: string;
    firstName: string;
    lastName: string;
    refreshToken: {
      /**
       * Time to live
       * 
       * Represents the time (in ms) after token creation when the server will revoke all authenticated access
       * and decline to refresh the existing token.
       * 
       * WARNING: This value is a number expressed as a string (eg. "600"),
       * perhaps this should be sent as a number directly. ...
       */
      ttl: string;
      validDate: string
    }  
}

export const parseJwt = (token: string): CustomToken => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };