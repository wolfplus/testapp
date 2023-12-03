import { Geoloc } from '../models/club';

export function calculateDistance(userLocation: Geoloc, clubLocaton: Geoloc){
    const lat1 = userLocation.latitude;
    const radianLat1 = lat1 * (Math.PI / 180);
    const lng1 = userLocation.longitude;
    const radianLng1 = lng1 * (Math.PI / 180);
    const lat2 = clubLocaton.latitude;
    const radianLat2 = lat2 * (Math.PI / 180);
    const lng2 = clubLocaton.longitude;
    const radianLng2 = lng2 * (Math.PI / 180);
    // tslint:disable-next-line:variable-name
    const earth_radius = 6371;
    const diffLat = (radianLat1 - radianLat2);
    const diffLng = (radianLng1 - radianLng2);
    const sinLat = Math.sin(diffLat / 2);
    const sinLng = Math.sin(diffLng / 2);
    const a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
    const distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
    return distance.toFixed(1);
}

/* export class LocationDistance {
    calculateDistance(userLocation: Geoloc, clubLocaton: Geoloc){
        const lat1 = userLocation.latitude;
        const radianLat1 = lat1 * (Math.PI / 180);
        const lng1 = userLocation.longitude;
        const radianLng1 = lng1 * (Math.PI / 180);
        const lat2 = clubLocaton.latitude;
        const radianLat2 = lat2 * (Math.PI / 180);
        const lng2 = clubLocaton.longitude;
        const radianLng2 = lng2 * (Math.PI / 180);
        const earth_radius = 6371;
        const diffLat = (radianLat1 - radianLat2);
        const diffLng = (radianLng1 - radianLng2);
        const sinLat = Math.sin(diffLat / 2);
        const sinLng = Math.sin(diffLng / 2);
        const a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
        const distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
        return distance.toFixed(3);
    }
} */
