import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { Text, View } from "../components/Themed";
import RecipeCard from "./RecipeCard";
import React from "react";
import { Recipe } from "./types";
import { dataQuery } from "./data.query";
import { dataService } from "./data.service";

async function getRecipes(
  setAccessToken,
  accessToken
): Promise<Recipe[] | null> {
  const recipeBuddyURL = "http://192.168.88.242:4000";
  if (!accessToken) {
    const { data } = await axios.post(recipeBuddyURL + "/api/auth/login", {
      username: "v",
      password: "testpass",
    });

    setAccessToken(data.access_token);
  }
  const authHeader = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return (
    (await axios.get(recipeBuddyURL + "/api/recipes", authHeader)).data || null
  );
}

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);
export default function GetRecipeScreen() {
  const shoppingListObservable = dataQuery["shoppingList"];

  const [shoppingList, setShoppingList] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    shoppingListObservable.subscribe({
      next(observedValue) {
        setShoppingList(observedValue);
      },
    });
  }, []);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<number | false>(false);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test </Text>

      <Button
        title="Check Recipes"
        onPress={async () => {
          const recipeData = await getRecipes(setAccessToken, accessToken);
          setRecipes(recipeData);
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
              shoppingList={shoppingList}
              addToShoppingList={(item) => dataService.addToShoppingList(item)}
            />
          )}
        />
      )}
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
