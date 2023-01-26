import { Store, StoreConfig } from '@datorama/akita';
import { ExistingProductDetails, Recipe } from './types';

export interface DataState {
    token: string;
    name: string;
    recipes: Recipe[],
    shoppingList: (string | undefined)[];
    lastReceivedBarcode?: string;
    existingProducts: Record<string, ExistingProductDetails>
}


// TODO parenthetical specification - ie "1 (16 ounce) package"
export const existingProducts: Record<string, ExistingProductDetails> = {
    'sugar': { inStockAmount: 1, inStockUnit: 'cup' },
    'kosher salt': { inStockAmount: 1, inStockUnit: 'cup' },
    'salt': { inStockAmount: 1, inStockUnit: 'cup' },
    'butter': { inStockAmount: 2, inStockUnit: 'cup' },
    'egg': { inStockAmount: 4, inStockUnit: 'unit' },
    'milk': { inStockAmount: 4, inStockUnit: 'unit' },
    'water': { inStockAmount: 4, inStockUnit: 'cup' },
    'flour': { inStockAmount: 4, inStockUnit: 'unit' },
    'sour cream': { inStockAmount: 4, inStockUnit: 'unit' },
    'garlic': { inStockAmount: 4, inStockUnit: 'unit' },
    'mayonnaise': { inStockAmount: 4, inStockUnit: 'unit' },
    'ground beef': { inStockAmount: 4, inStockUnit: 'unit' },
    'white sugar': { inStockAmount: 4, inStockUnit: 'unit' },
    'soy sauce': { inStockAmount: 4, inStockUnit: 'unit' },
    'oyster sauce': { inStockAmount: 4, inStockUnit: 'unit' },
    'apple cider vinegar': { inStockAmount: 4, inStockUnit: 'unit' },
    'bay leaf': { inStockAmount: 4, inStockUnit: 'unit' },
    'cornstarch': { inStockAmount: 4, inStockUnit: 'unit' },
    'chicken broth': { inStockAmount: 4, inStockUnit: 'cup' },
    'mashed potatoes': { inStockAmount: 4, inStockUnit: 'cup' },
    'caraway seeds': { inStockAmount: 4, inStockUnit: 'cup' },
    'heavy cream': { inStockAmount: 4, inStockUnit: 'cup' },
    'olive oil': { inStockAmount: 4, inStockUnit: 'cup' },
    'vegetable oil': { inStockAmount: 4, inStockUnit: 'cup' },
    'fish sauce': { inStockAmount: 4, inStockUnit: 'cup' },
}
export function createInitialState(): DataState {
    return {
        token: '',
        name: '',
        recipes: [],
        shoppingList: [],
        existingProducts
    };
}

@StoreConfig({ name: 'data' })
export class DataStore extends Store<DataState> {
    constructor() {
        super(createInitialState());
    }
}

export const dataStore = new DataStore()