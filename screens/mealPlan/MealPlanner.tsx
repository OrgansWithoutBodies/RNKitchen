import React, { useEffect, useMemo, useState } from "react";

import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { dataQuery } from "../../state/data.query";
import { View, Text, Button } from "../../components/Themed";
import { Meal, mealColors, RecipeBuddyRecipe } from "../../structs/types";

const meals: Record<string, Meal> = {};

function findRecipe(recipes: RecipeBuddyRecipe[], dot: Meal["dots"][number]) {
  const test = recipes.find((recipe) => recipe._id === dot.recipeID);
  return test;
}
export default function MealPlanner() {
  // TODO leftovers
  // const dates: MarkedDates = meals.map((meal) => { return [meal.date, { marked: true, dotColor: mealColors[meal.division] }] })

  const [recipes, setRecipes] = useState<RecipeBuddyRecipe[]>([]);
  const recipesObservable = dataQuery["recipes"];

  useEffect(() => {
    recipesObservable.subscribe({
      next(observedValue) {
        setRecipes(observedValue);
      },
    });
  }, []);
  const recipeIds = useMemo(() => {
    return recipes.map((recipe) => recipe._id);
  }, [recipes]);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  // TODO setPlannedMeals doesnt update calendar
  const [plannedMeals, setPlannedMeals] = useState<Record<string, Meal>>(meals);
  // TODO select on add/change meal
  const daysMeals = activeDate ? plannedMeals[activeDate] || null : null;
  // https://www.npmjs.com/package/react-native-dropdown-select-list
  const lunchDot = daysMeals?.dots.find((dot) => dot.key === "Lunch");
  const dinnerDot = daysMeals?.dots.find((dot) => dot.key === "Dinner");
  return (
    <View>
      <Calendar
        style={{
          borderWidth: 5,
          backgroundColor: "#888",
          borderColor: "gray",
          height: 350,
        }}
        theme={{
          calendarBackground: "#333333",
          backgroundColor: "#FF0000",
          selectedDayBackgroundColor: "#FF0000",
        }}
        markingType={"multi-dot"}
        markedDates={plannedMeals}
        onDayPress={(day) => setActiveDate(day.dateString)}
      />
      <View>
        <View>
          {activeDate && (
            <View>
              <Text style={{ color: "white" }}>{activeDate}</Text>
              {lunchDot ? (
                <Text style={{ color: "white" }}>
                  <Text style={{ fontWeight: "bold" }}>Lunch:</Text>
                  {" " +
                    recipes.find((recipe) => {
                      return recipe._id === lunchDot.recipeID;
                    })?.name}
                </Text>
              ) : (
                <Button
                  title="Add Lunch"
                  onPress={() => {
                    const semiPlannedMeals = plannedMeals;
                    semiPlannedMeals[activeDate!] = {
                      dots: [
                        {
                          recipeID: recipeIds[0],
                          key: "Lunch",
                          color: mealColors["Lunch"],
                        },
                      ],
                    };
                    setPlannedMeals(semiPlannedMeals);
                  }}
                />
              )}

              {dinnerDot ? (
                <Text style={{ color: "white" }}>
                  <Text style={{ fontWeight: "bold" }}>Dinner:</Text>
                  {findRecipe(recipes, dinnerDot)?.name}
                </Text>
              ) : (
                <Button
                  title="Add Dinner"
                  onPress={() => {
                    const semiPlannedMeals = plannedMeals;
                    const existingMeals =
                      semiPlannedMeals[activeDate]?.dots || [];
                    semiPlannedMeals[activeDate!] = {
                      dots: [
                        ...existingMeals,
                        {
                          // TODO let user choose among recipes
                          recipeID: recipeIds[1],
                          key: "Dinner",
                          color: mealColors["Dinner"],
                        },
                      ],
                    };
                    setPlannedMeals(semiPlannedMeals);
                  }}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
