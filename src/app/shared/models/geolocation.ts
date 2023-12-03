export interface Geolocation {
    longitude: number;
    latitude: number;
}

export enum SearchTarget {
    CITY = "city",
    CLUB = "club"
  }
  
  export interface RecentPlaceSearch {
    cities: Array<any>;
    clubs: Array<any>;
  }
  
  export const AROUND_ME = "AROUND_ME";
  
