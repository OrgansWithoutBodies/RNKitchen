import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { Text, View, Button } from "../../components/Themed";
import RecipeCard from "../recipes/RecipeCard";
import React from "react";
import { RecipeBuddyRecipe } from "../../structs/types";
import { dataQuery } from "../../state/data.query";
import RestaurantCard, { Restaurant } from "./RestaurantCard";
// https://www.uber.com/blog/uber-eats-query-understanding/
// http://eng.uber.com/wp-content/uploads/2018/06/Figure_2.png
// https://www.uber.com/blog/uber-eats-graph-learning/
// https://www.reddit.com/r/Frontend/comments/hzikhc/550_customizable_size_color_stroke_opensource_svg/
// TODO scrape google maps?
//    https://towardsdatascience.com/foods-around-me-google-maps-data-scraping-with-python-google-colab-588986c63db3?gi=dfdfdd3f71b3
//    https://dagshub.com/methoomirza/GoogleMaps-Restaurant-Scraper
//    https://medium.com/@foodspark/how-to-scrape-restaurants-data-from-google-google-map-restaurants-data-scraping-efd38c4b5a58
//    https://outscraper.com/google-maps-scrape-all-places/
//    https://apify.com/compass/easy-google-maps
//    https://github.com/apify-projects/store-crawler-google-places
//
// TODO recipe vs preparation instructions? Whats technically the difference?
const restaurants: Restaurant[] = [
  {
    name: "Stir Fry Chinese Food",
    address: "2040-C Harbison Dr, Vacaville CA",
    phoneNumber: "(707)448-3233",
    hours: ["10:30AM", "9PM"],
    // TODO different prices for different sizes?
    menu: [
      {
        name: "Fried Cheese Won Tons",
        priceUSD: 0.99,
        dishCategory: "Appetizers",
      },
      { name: "Fried Pawns", priceUSD: 0.99, dishCategory: "Appetizers" },
    ],
  },
  {
    name: "Inca's Palace",
    address: "2040-C Harbison Dr, Vacaville CA",
    phoneNumber: "(707)448-3233",
    hours: ["10:30AM", "9PM"],
    // TODO different prices for different sizes?
    menu: [
      {
        name: "Empanadas de Carne",
        priceUSD: 8,
        dishCategory: "Appetizers",
      },
    ],
  },
];
export default function GetRestaurantsScreen() {
  // const shoppingListObservable = dataQuery["shoppingList"];
  // const recipesObservable = dataQuery["recipes"];

  // const [shoppingList, setShoppingList] = useState<(string | undefined)[]>([]);
  // const [recipes, setRecipes] = useState<RecipeBuddyRecipe[] | null>(null);

  // useEffect(() => {
  //   shoppingListObservable.subscribe({
  //     next(observedValue) {
  //       setShoppingList(observedValue);
  //     },
  //   });
  //   recipesObservable.subscribe({
  //     next(observedValue) {
  //       setRecipes(observedValue);
  //     },
  //   });
  // }, []);
  const [openRestaurant, setOpenRestaurant] = useState<number | false>(false);

  return (
    <View style={styles.container}>
      {restaurants && (
        <FlatList
          data={restaurants}
          renderItem={({ item, index }) => (
            <RestaurantCard
              restaurant={item}
              expanded={openRestaurant === index}
              setExpanded={(boolVal) =>
                boolVal ? setOpenRestaurant(index) : setOpenRestaurant(false)
              }
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
