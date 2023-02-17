import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { View, Text, Button } from "../../components/Themed";

import { dataQuery, DataQuery } from "../../state/data.query";
import { dataService } from "../../state/data.service";
import {
  NaiveExistingProductDetails,
  RecipeBuddyRecipe,
  Units,
} from "../../structs/types";

type RestaurantDish = {
  name: string;
  details?: string;
  picture?: string;
  dishCategory?: string;
  markings?: {
    spicy?: boolean;
    vegan?: boolean;
    // sorta the same but just to better reflect verbage
    popular?: boolean;
    special?: boolean;
  };
  priceUSD: number | "seasonal";
  options?: string[];
};
export type Restaurant = {
  name: string;
  address: string;
  phoneNumber: string;
  menuPicture?: string;
  menu: RestaurantDish[];
  // different hours on different days, different times for differnt sections (multiple menus?)
  hours: [string, string];
};

// add 'get food from restaurant' to meal planner
export default function RestaurantCard({
  restaurant,
  expanded,
  setExpanded,
}: {
  restaurant: Restaurant;
  expanded: boolean;
  setExpanded: (expand: boolean) => void;
}) {
  // const [existingProducts, setExistingProducts] = useState<
  //   Record<string, ExistingProductDetails>
  // >({});
  // const existingProductsObservable = dataQuery["existingProducts"];

  // useEffect(() => {
  //   existingProductsObservable.subscribe({
  //     next(observedValue) {
  //       setExistingProducts(observedValue);
  //     },
  //   });
  // }, []);
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => setExpanded(!expanded)}
      >
        {/* <View style={{ flexDirection: 'row' }}> */}
        <View>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={{ ...styles.title, fontSize: 10 }}>
            {restaurant.address}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.addToMealPlanButton}
        >
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
        {/* <Image style={{ width: '100%', height: '20%' }} source={{ uri: restaurant.imageUrl }} /> */}
        {/* </View> */}
      </TouchableOpacity>
      <View>
        {expanded && (
          <View>
            <View
              style={{ backgroundColor: "#333", padding: 10, width: "95%" }}
            >
              {restaurant.menu.map((dish, ii) => {
                return (
                  <View>
                    <Text style={styles.text}> {dish.name}</Text>
                    <Text style={{ ...styles.text, fontSize: 10 }}>
                      ${dish.priceUSD}
                    </Text>
                    {dish.details && (
                      <Text style={styles.text}> {dish.details}</Text>
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
