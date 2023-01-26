import { Query } from '@datorama/akita';
import { DataState, dataStore, DataStore } from './data.store';

export class DataQuery extends Query<DataState> {

    public shoppingList = this.select('shoppingList')

    constructor(protected store: DataStore) {
        super(store);
    }
}
export const dataQuery = new DataQuery(dataStore)