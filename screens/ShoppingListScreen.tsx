import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, Button, TextInput, ToastAndroid } from "react-native";
import { dataQuery } from "./data.query";
import { dataService } from "./data.service";

export default function ShoppingList() {
  const shoppingListObservable = dataQuery["shoppingList"];

  const [shoppingList, setShoppingList] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    shoppingListObservable.subscribe({
      next(observedValue) {
        setShoppingList(observedValue);
      },
    });
  }, []);
  return (
    <View>
      {shoppingList.map((item, ii) => (
        <View>
          <TextInput
            placeholder="..."
            value={item}
            onChangeText={(text) => dataService.editShoppingListItem(ii, text)}
            style={{ backgroundColor: "white" }}
          />
          <Button
            color="red"
            title="X"
            onPress={() => dataService.removeFromShoppingList(ii)}
          />
        </View>
      ))}
      <Button
        title="add to list"
        onPress={() => {
          console.log("TEST123-adding", dataService);
          return dataService.addToShoppingList(undefined);
        }}
      />
      <Button
        disabled={shoppingList.includes(undefined) || shoppingList.length === 0}
        title="send list to printer"
        onPress={() => {
          console.log(shoppingList);
          axios
            .post("http://192.168.88.242:8000/printShoppingList", {
              list: shoppingList,
            })
            .catch(() => ToastAndroid.show("Bad Request!", ToastAndroid.SHORT));
        }}
      />
    </View>
  );
}
