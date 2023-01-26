import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { dataQuery, DataQuery } from "./data.query";
import { existingProducts } from "./data.store";
import { ExistingProductDetails, Recipe, Units } from "./types";

const degrees = [
  "thin",
  "thinly",
  "fine",
  "large",
  "small",
  "medium",
  "very finely",
  "well-",
  "hot",
  "lukewarm",
  "lightly packed",
] as const;
const processeds = [
  "chopped",
  "beaten",
  "peeled",
  "drained",
  "rinsed",
  "grated",
  "diced",
  "ground",
  "dried",
  "shredded",
  "sliced",
  "washed",
  "fresh",
  "stems removed",
  "divided",
] as const;
// todo "and"
// todo "as needed"/"to taste"
const optionalStr = "optional";
type ParsedIngredient = {
  unit?: (typeof Units)[number];
  num: number;
  ingredient: string;
  isOptional: boolean;
};
// TODO different plural unit name
function parseIngredientUsage(str: string): string {
  const preformattedStr = str.toLowerCase().replace("  ", " ");
  const countStr = new RegExp("([0-9/.]*) (.*)");
  const countMatched = countStr.exec(preformattedStr) || [];
  const numFound = countMatched.length > 1 ? eval(countMatched[1]) : null;
  const stringWithoutCount =
    countMatched.length > 1 ? countMatched[2] : preformattedStr;
  const unitsMatched = Units.map((unit) => {
    const leftExp = new RegExp(`(${unit})s? (.*)`);
    const leftMatch = leftExp.exec(stringWithoutCount);
    const rightExp = new RegExp(`(.*) (${unit})s?`);
    const rightMatch = rightExp.exec(stringWithoutCount);
    if (leftMatch) {
      return [2, ...leftMatch];
    }
    if (rightMatch) {
      return [3, ...rightMatch];
    }
    return [];
  })
    .filter((val) => val !== null)
    .flat();
  const unitKey = unitsMatched.length > 1 ? (unitsMatched[0] as number) : null;
  const unitsFound = unitKey ? unitsMatched[unitKey] : null;
  const stringWithoutUnits = unitKey
    ? unitsMatched[unitKey === 2 ? 3 : 2]
    : stringWithoutCount;

  const optionalMatched =
    new RegExp("(.*), optional").exec(stringWithoutUnits) || [];
  const isOptional = optionalMatched.length > 1;
  const stringWithoutOptional = isOptional
    ? optionalMatched[1]
    : stringWithoutUnits;

  const finalString = stringWithoutOptional as string;
  return finalString;
}
export default function RecipeCard({
  recipe,
  expanded,
  setExpanded,
  shoppingList,
  addToShoppingList,
}: {
  recipe: Recipe;
  expanded: boolean;
  setExpanded: (expand: boolean) => void;
  shoppingList: string[];
  addToShoppingList: (item: string) => void;
}) {
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => setExpanded(!expanded)}
      >
        {/* <View style={{ flexDirection: 'row' }}> */}
        <Text style={styles.title}>{recipe.name}</Text>
        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.addToMealPlanButton}
        >
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
        {/* <Image style={{ width: '100%', height: '20%' }} source={{ uri: recipe.imageUrl }} /> */}
        {/* </View> */}
      </TouchableOpacity>
      <View>
        {expanded && (
          <View>
            <View>
              {recipe.ingredients.map((ingredient) => {
                const ingredientName = parseIngredientUsage(ingredient);
                const recognizedIngredient = existingProducts[ingredientName];
                {
                  /* TODO parse ingredient usage */
                }
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      borderWidth: 1,
                      margin: 3,
                      borderColor: "white",
                      backgroundColor: "#666",
                      paddingLeft: 10,
                    }}
                  >
                    <Text style={styles.ingredients}>{ingredient}</Text>
                    {/* TODO proxy product names? */}
                    {/* TODO # servings */}
                    {/* TODO add to shopping list if below required amt */}
                    {recognizedIngredient ? (
                      <View
                        style={{
                          width: "70%",
                          flexDirection: "row",
                          borderColor: "white",
                        }}
                      >
                        <Text
                          style={{
                            width: "20%",
                            color: "white",
                            fontStyle: "italic",
                          }}
                        >
                          {recognizedIngredient.inStockAmount} - (
                          {recognizedIngredient.inStockUnit})
                        </Text>
                        {/* <TouchableOpacity activeOpacity={0.95} style={styles.replaceButton}>
                                            <Text style={styles.text}>Replace</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.95} style={styles.ignoreButton}>
                                            <Text style={styles.text}>Ignore</Text>
                                        </TouchableOpacity> */}
                        <TouchableOpacity
                          activeOpacity={0.95}
                          style={styles.ignoreButton}
                        >
                          <Text
                            style={styles.text}
                            onPress={() => {
                              if (!shoppingList.includes(ingredientName)) {
                                addToShoppingList(ingredientName);
                              }
                              console.log(shoppingList);
                            }}
                          >
                            {shoppingList.includes(ingredientName)
                              ? "On List"
                              : "ShoppingList"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.95}
                        style={styles.button}
                      >
                        <Text style={styles.text}>Add To Grocy</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
            <View
              style={{ backgroundColor: "#333", padding: 10, width: "95%" }}
            >
              {recipe.steps.map((step, ii) => {
                return (
                  <View>
                    <Text style={styles.text}> {step}</Text>
                    {ii < recipe.steps.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blackText: {
    fontSize: 14,
    padding: 10,
    fontWeight: "bold",
    color: "black",
  },

  text: {
    fontSize: 14,
    padding: 10,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    flexDirection: "row",
    height: "50%",
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    elevation: 3,
  },
  replaceButton: {
    flexDirection: "row",
    height: "100%",
    width: "20%",
    color: "black",
    backgroundColor: "#FFAAAA",
    alignItems: "center",
    justifyContent: "center",
  },
  ignoreButton: {
    flexDirection: "row",
    height: "100%",
    width: "20%",
    color: "black",
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
  addToMealPlanButton: {
    flexDirection: "row",
    height: "100%",
    width: "20%",
    color: "black",
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    borderRadius: 10,
    margin: 5,
    padding: 40,
    borderWidth: 3,
    borderColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ingredients: {
    color: "white",
    width: "40%",
  },
  title: {
    color: "white",
    fontSize: 20,
    width: "80%",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "white",
  },
});
