import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Button, Text, View } from "../../components/Themed";
import React from "react";
import { dataQuery } from "../../state/data.query";
import {
  LocationId,
  ProductsInLocation,
  StorageLocation,
} from "../../state/data.store";
import { GrocyProduct } from "../../structs/types";
import { useData } from "../../state/useAkita";
import { dataService } from "../../state/data.service";

export default function LocationScreen() {
  const [{ productsInLocations: locationProducts, locations, products }] =
    useData(["productsInLocations", "locations", "products"]);

  return (
    <View>
      {locations.map((location) => {
        return (
          <View>
            <Text style={{ fontSize: 20 }}>{location.name}</Text>
            <Button
              title="+"
              onPress={() => {
                // TODO raise window that scrolls through available products, then asks for input
                dataService.addStock(0, location.id, 4);
              }}
            />
            <View>
              {locationProducts &&
                locationProducts[location.id! as LocationId] &&
                locationProducts[location.id! as LocationId].map(
                  (locationProduct) => {
                    return (
                      <Text style={{ fontSize: 10 }}>
                        {products[locationProduct.productId].name}x
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
