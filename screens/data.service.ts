import { dataStore, DataStore } from './data.store';

export class DataService {
    constructor(private dataStore: DataStore) { }

    public addToShoppingList(item: string | undefined) {
        this.dataStore.update((store) => {
            return { ...store, shoppingList: [...store.shoppingList, item] }
        })
    }

    public editShoppingListItem(ii: number, item: string | undefined) {
        this.dataStore.update((store) => {
            const mutableShoppingList = store.shoppingList

            return { ...store, shoppingList: [...mutableShoppingList.slice(0, ii), item || undefined, ...mutableShoppingList.slice(ii + 1)] }
        })
    }

    public removeFromShoppingList(ii: number) {
        this.dataStore.update((store) => {
            const mutableShoppingList = store.shoppingList

            return { ...store, shoppingList: [...mutableShoppingList.slice(0, ii), ...mutableShoppingList.slice(ii + 1)] }
        })
    }
}
export const dataService = new DataService(dataStore)