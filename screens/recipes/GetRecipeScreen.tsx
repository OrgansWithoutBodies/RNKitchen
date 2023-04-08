import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { Text, View, Button } from "../../components/Themed";
import RecipeCard from "./RecipeCard";
import React from "react";
import { RecipeBuddyRecipe } from "../../structs/types";
import { dataQuery } from "../../state/data.query";
import { dataService } from "../../state/data.service";
import { useData } from "../../state/useAkita";

export default function GetRecipeScreen() {
  const [{ shoppingList, recipes }] = useData(["shoppingList", "recipes"]);

  const [openRecipe, setOpenRecipe] = useState<number | false>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test </Text>

      <Button
        title="Check Recipes"
        onPress={async () => {
          await dataService.getRecipesFromRecipeBuddy();
        }}
      />
      {recipes && (
        <FlatList
          data={recipes}
          renderItem={({ item, index }) => (
            <RecipeCard
              recipe={item}
              expanded={openRecipe === index}
              setExpanded={(boolVal) =>
                boolVal ? setOpenRecipe(index) : setOpenRecipe(false)
              }
              recipes={shoppingList}
              addToShoppingList={(item) => dataService.addToShoppingList(item)}
            />
          )}
        />
      )}
      <Button
        title="Add New Recipe"
        onPress={async () => {
          // TODO
          // await dataService.getRecipesFromRecipeBuddy();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
