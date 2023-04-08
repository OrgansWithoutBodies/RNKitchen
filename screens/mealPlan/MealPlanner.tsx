import React, { useRef, useState } from "react";

import { Calendar, DateData } from "react-native-calendars";
import { View, Text, Button } from "../../components/Themed";
import { MealSet, RecipeBuddyRecipe, MealSlot } from "../../structs/types";
import { useData } from "../../state/useAkita";
import { dataService } from "../../state/data.service";
import { DateString } from "../../state/data.store";
import { AddToMealPlan } from "./AddToMealPlan";

const meals: Record<string, MealSet> = {};
const weekday = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
function findRecipe(
  recipes: RecipeBuddyRecipe[],
  dot: MealSet["dots"][number]
) {
  const test = recipes.find((recipe) => recipe._id === dot.recipeID);
  return test;
}

const dayOfWeek = (dateString: DateString) => {
  return weekday[new Date(dateString).getDay()];
};
export default function MealPlanner() {
  const modalRef = useRef();
  // TODO leftovers

  const [{ mealPlan: immMealPlan, recipes }] = useData(["mealPlan", "recipes"]);

  const [activeDateObj, setActiveDate] = useState<DateData | undefined>(
    undefined
  );
  const activeDate = activeDateObj?.dateString as DateString;
  const mealPlan = { ...immMealPlan };
  if (activeDate) {
    mealPlan[activeDate] = {
      dots: mealPlan[activeDate]?.dots || [],
      selected: true,
    };
    // TODO holidays as special highlight
  }
  const [modalState, setModalState] = useState<MealSlot | null>(null);
  const openModal = (mealDivision) => {
    setModalState(mealDivision);
    modalRef.current!.show();
  };
  // TODO select on add/change meal
  const daysMeals = activeDate ? mealPlan[activeDate] || null : null;
  // https://www.npmjs.com/package/react-native-dropdown-select-list
  const lunchDot = daysMeals?.dots.find((dot) => dot.slot === "Lunch");
  const dinnerDot = daysMeals?.dots.find((dot) => dot.slot === "Dinner");
  return (
    <View>
      <AddToMealPlan
        modalRef={modalRef}
        setSelected={(recipeId) => {
          console.log(recipeId);
          dataService.addRecipeToPlan(activeDate!, recipeId, modalState);
          setModalState(null);
        }}
        options={recipes.map((recipe) => ({
          label: recipe.name,
          value: recipe._id,
        }))}
      />
      {/* https://blog.logrocket.com/create-customized-shareable-calendars-react-native/ */}
      {/* TODO week calendar? WeekCalendar */}
      <Calendar
        style={{
          width: "100%",

          borderColor: "#FFFFFF",
          borderWidth: 3,
          padding: 10,
          borderRadius: 20,
        }}
        theme={{
          line: {},
          // color of next/prev month
          textDisabledColor: "#666666",

          calendarBackground: "#333333",

          dayTextColor: "#FFFFFF",
          monthTextColor: "#FFFFFF",

          todayBackgroundColor: "#FFFFFF",
          todayTextColor: "#333333",

          selectedDayBackgroundColor: "#FF0000",
          selectedDayTextColor: "#FFFFFF",
        }}
        markingType={"multi-dot"}
        markedDates={mealPlan}
        onDayPress={(day) => {
          console.log("TEST123", day);
          setActiveDate(day);
        }}
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
                    openModal("Lunch");
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
                    openModal("Dinner");
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
