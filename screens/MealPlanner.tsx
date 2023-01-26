import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { Meal, mealColors } from "./types";

const recipes = { '0': 'test meal', '1': 'testing meal', '32': 'other recipe' }
const meals: Record<string, Meal> = {
    '2023-01-26': {
        dots: [
            { recipeID: '0', key: 'Dinner', color: mealColors['Dinner'] },
            { recipeID: '1', key: 'Lunch', color: mealColors['Lunch'] }
        ]
    },
    '2023-01-25': { dots: [{ key: 'Lunch', color: mealColors['Lunch'], recipeID: '32', }] },
}

export default function MealPlanner() {
    // TODO leftovers
    // const dates: MarkedDates = meals.map((meal) => { return [meal.date, { marked: true, dotColor: mealColors[meal.division] }] })
    console.log(meals)
    const [activeDate, setActiveDate] = useState<string | null>(null)
    // TODO setPlannedMeals doesnt update calendar
    const [plannedMeals, setPlannedMeals] = useState<Record<string, Meal>>(meals)
    // TODO select on add/change meal
    const daysMeals = activeDate ? plannedMeals[activeDate] || null : null
    // https://www.npmjs.com/package/react-native-dropdown-select-list
    const lunchDot = daysMeals?.dots.find((dot) => dot.key === 'Lunch')
    const dinnerDot = daysMeals?.dots.find((dot) => dot.key === 'Dinner')
    return <View>
        <Calendar
            style={{
                borderWidth: 5,
                backgroundColor: '#888',
                borderColor: 'gray',
                height: 350
            }}
            theme={{
                calendarBackground: '#333333',
                backgroundColor: '#FF0000',
                selectedDayBackgroundColor: '#FF0000',
            }}
            markingType={'multi-dot'}
            markedDates={plannedMeals}
            onDayPress={(day) => setActiveDate(day.dateString)}
        />
        <View>

            <View >
                {activeDate &&
                    <View>
                        <Text style={{ color: 'white' }}>{activeDate}</Text>
                        {lunchDot ? <Text style={{ color: 'white' }}><Text style={{ fontWeight: 'bold' }}>
                            Lunch:
                        </Text>
                            {' ' + recipes[lunchDot.recipeID]}</Text>
                            :
                            <Button title="Add Lunch" onPress={() => {
                                const semiPlannedMeals = plannedMeals
                                semiPlannedMeals[activeDate!] = {
                                    dots: [
                                        { recipeID: '1', key: 'Lunch', color: mealColors['Lunch'] }
                                    ]
                                }
                                setPlannedMeals(semiPlannedMeals)
                            }} />}

                        {dinnerDot ? <Text style={{ color: 'white' }}><Text style={{ fontWeight: 'bold' }}>
                            Dinner:
                        </Text>
                            {' ' + recipes[dinnerDot.recipeID]}</Text>
                            :
                            <Button title="Add Dinner" onPress={() => {
                                const semiPlannedMeals = plannedMeals
                                const existingMeals = semiPlannedMeals[activeDate]?.dots
                                semiPlannedMeals[activeDate!] = {
                                    dots: [
                                        ...existingMeals,
                                        { recipeID: '32', key: 'Dinner', color: mealColors['Dinner'] },
                                    ]
                                }
                                setPlannedMeals(semiPlannedMeals)
                            }} />}
                    </View>
                }
            </View>

        </View>
    </View>
}