import { ShopItem } from "src/app/shared/models/shop-item";
import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';


@Injectable({
    providedIn: 'root',
})
export class CartState {

    arrayCartState: any = [];

    state: ICartState = {
        totalItems: 0,
        totalPrice: 0,
        items: []
    };

    public constructor(
        private environmentService: EnvironmentService
    ) {
        this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach((element)=> {
            this.arrayCartState.push({id: element, state: {totalItems: 0,totalPrice: 0,items: []}});
        });

        this.state = {
            totalItems: 0,
            totalPrice: 0,
            items: []
        };
    }

    public addItem(item: ShopItem) {
        const index = this.state.items.findIndex(e => e.item.id === item.id);
        if (index === -1) {
            this.state.items.push({ item, count: 1 });
        } else {
            this.state.items[index].count++;
        }

        this.state.totalItems++;
        this.state.totalPrice += item.unitaryPrice;
    }

    public removeItem(item: ShopItem) {
        const index = this.state.items.findIndex(el => {
            return el.item.id === item.id;
        });
        if (this.state.items[index].count <= 1) {
            this.state.items.splice(index, 1);
        } else {
            this.state.items[index].count--;
        }
        if (this.state.totalItems > 0) {
            this.state.totalItems--;
            this.state.totalPrice -= item.unitaryPrice;
        }
    }

    public updateItem(idSelected, item, count) {
        const position = this.arrayCartState.findIndex(e => e.id == idSelected);
        const index = this.arrayCartState[position]['state'].items.findIndex(e => e.item.id === item.id);
        if (index === -1) {
            this.arrayCartState[position]['state'].items.push({ item, count });
            this.arrayCartState[position]['state'].totalItems += count;
            this.arrayCartState[position]['state'].totalPrice += item.unitaryPrice * count;
        } else {
            if (count === 0) {
                this.arrayCartState[position]['state'].totalPrice -= item.unitaryPrice * this.arrayCartState[position]['state'].items[index].count;
                this.arrayCartState[position]['state'].totalItems -= this.arrayCartState[position]['state'].items[index].count;
                this.arrayCartState[position]['state'].items.splice(index, 1);
            } else {
                if (item.customData) {
                    this.arrayCartState[position]['state'].items[index].item.customData = item.customData;
                }
                this.arrayCartState[position]['state'].totalItems -= this.arrayCartState[position]['state'].items[index].count;
                this.arrayCartState[position]['state'].totalPrice -= item.unitaryPrice * this.arrayCartState[position]['state'].items[index].count;
                this.arrayCartState[position]['state'].items[index].count = count;
                this.arrayCartState[position]['state'].totalItems += this.arrayCartState[position]['state'].items[index].count;
                this.arrayCartState[position]['state'].totalPrice += item.unitaryPrice * this.arrayCartState[position]['state'].items[index].count;
            }

        }
    }

    public getState(): ICartState {
        return this.state;
    }

    public getStates(idSelected): any {
        if (this.arrayCartState) {
            if (this.arrayCartState.length > 0) {
                const postition = this.arrayCartState.findIndex(e => e.id == idSelected);
                if (this.arrayCartState[postition]) {
                    return this.arrayCartState[postition].state
                }
            }
        }
        return null;
    }

    public resetCart() {
        this.state = {
            totalItems: 0,
            totalPrice: 0,
            items: []
        };

        this.arrayCartState = []

        this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach((element)=> {
            this.arrayCartState.push({id: element, state: {totalItems: 0,totalPrice: 0,items: []}});
        });
    }
}

export interface ICartState {
    items: IItem[];
    totalItems: number;
    totalPrice: number;
}

export interface IItem {
    item: ShopItem;
    count: number;
}

