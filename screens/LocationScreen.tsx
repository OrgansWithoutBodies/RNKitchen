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

export default function LocationScreen() {
  const [locationProducts, setLocationProducts] = useState<ProductsInLocation>(
    {}
  );
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [products, setProducts] = useState<GrocyProduct[]>([]);

  const locationProductsObservable = dataQuery["productsInLocations"];
  const locationsObservable = dataQuery["locations"];
  const productsObservable = dataQuery["products"];

  useEffect(() => {
    locationProductsObservable.subscribe({
      next(observedValue) {
        setLocationProducts(observedValue);
      },
      error(errorVal) {
        console.log("TEST123", errorVal);
      },
    });
    locationsObservable.subscribe({
      next(observedValue) {
        setLocations(observedValue);
      },
      error(errorVal) {},
    });
    productsObservable.subscribe({
      next(observedValue) {
        setProducts(observedValue);
      },
      error(errorVal) {},
    });
  }, []);
  // console.log("TEST123", locationProducts);
  return (
    <View>
      {locations.map((location) => {
        return (
          <View>
            <Text style={{ fontSize: 20 }}>{location.name}</Text>
            <View>
              {locationProducts[location.id! as LocationId] &&
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
