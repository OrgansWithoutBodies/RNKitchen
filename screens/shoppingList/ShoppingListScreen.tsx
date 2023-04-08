import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { TextInput, ToastAndroid } from "react-native";
import { View, Text, Button } from "../../components/Themed";
import { dataQuery } from "../../state/data.query";
import { dataService } from "../../state/data.service";
import { useData } from "../../state/useAkita";

export default function ShoppingList() {
  const [{ shoppingList }] = useData(["shoppingList"]);
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
          return dataService.addToShoppingList(undefined);
        }}
      />
      <Button
        disabled={shoppingList.includes(undefined) || shoppingList.length === 0}
        title="send list to printer"
        onPress={() => {
          dataService.sendShoppingListToThermalPrinter();
        }}
      />
    </View>
  );
}
