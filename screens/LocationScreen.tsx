import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import React from "react";
import { dataQuery } from "../state/data.query";
import {
  LocationId,
  ProductsInLocation,
  StorageLocation,
} from "../state/data.store";
import { GrocyProduct } from "../structs/types";
import { useAkita } from "../state/useAkita";
import { dataService } from "../state/data.service";

export default function LocationScreen() {
  const [{ productsInLocations: locationProducts, locations, products }] =
    useAkita(dataQuery, dataService, [
      "productsInLocations",
      "locations",
      "products",
    ]);
  console.log("TEST123", locations);
  return (
    <View>
      {locations.map((location) => {
        return (
          <View>
            <Text style={{ fontSize: 20 }}>{location.name}</Text>
            <View>
              {locationProducts &&
                locationProducts[location.id! as LocationId] &&
                locationProducts[location.id! as LocationId].map(
                  (locationProduct) => {
                    return (
                      <Text style={{ fontSize: 10 }}>
                        {products[locationProduct.productId].name}x{" "}
                        {locationProduct.countAtLocation}
                      </Text>
                    );
                  }
                )}
            </View>
          </View>
        );
      })}
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
