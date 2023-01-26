
export interface Recipe {
    _id: string;
    url: string;
    name: string;
    imageUrl: string;
    ingredients: string[];
    steps: string[];
}

export type ShoppingListIncomplete = (string | undefined)[]
export type ShoppingList = string[]

export type MealDivision = 'Lunch' | 'Dinner'
export const mealColors: Record<MealDivision, string> = { 'Dinner': 'red', 'Lunch': 'green' }
export type Meal = {
    dots: {

        recipeID: string, key: MealDivision, color: string
    }[],
}
export const Units = ['tablespoon', 'teaspoon', 'cup', 'pound', 'pinch', 'tsp', 'tbsp', 'clove', 'ounce', 'piece', 'unit'] as const

export type ExistingProductDetails = { inStockAmount: number, inStockUnit: typeof Units[number] }
