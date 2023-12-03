import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { ShopItem } from '../models/shop-item';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private httpService: HttpService) {

  }

  getShopItems(clubId: string, itemsPerPage): Observable<Array<ShopItem>> {
    return this.httpService.baseHttp('get', `/products?club.id=${clubId}&itemsPerPage=${itemsPerPage}`, {}, false);
  }

  getShopItemsByCategory(clubId: string, categoryId: string, itemsPerPage): Observable<Array<ShopItem>> {
    return this.httpService.baseHttp('get', `/products?club.id=${clubId}&categories.id[]=${categoryId}&itemsPerPage=${itemsPerPage}`, {}, false);
  }

  getShopCategories(clubId: string): Observable<any> {
    return this.httpService.baseHttp('get', `/products/categories?club.id=${clubId}`, {}, false);
  }


  getShopItemDetails(itemId) {
    return this.httpService.baseHttp('get', `/products/${itemId}`, {}, false);
  }

}
