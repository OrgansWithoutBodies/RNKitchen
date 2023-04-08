import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, ToastAndroid } from "react-native";
import axios from "axios";
import { Button, Text, View } from "../components/Themed";
import { Axios as AxiosAsync } from "axios-observable";
import React from "react";
import { SocketStarter, useWebSocketStarter } from "../hooks/useWebSocket";
import { dataQuery } from "../state/data.query";
import { useData } from "../state/useAkita";
import { dataService } from "../state/data.service";

// TODO lookup non-loc barcodes in that openfood thingamajig
export default function BarcodeScreen() {
  // Start subscription to websocket
  const barcodeWebsocketObservable = dataQuery["barcodeWebSocket"];
  useWebSocketStarter(barcodeWebsocketObservable);

  const barcodes = { "12345": "test", "23456": "test123" };
  const [{ scannedLocationCode: barcode }] = useData(["scannedLocationCode"]);
  const [isRelocating, setIsRelocating] = useState<boolean>(false);
  const [relocateCode, setRelocateCode] = useState<string | null>(null);
  const [newBarcodeInfo, setNewBarcodeInfo] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {newBarcodeInfo && <Text>{newBarcodeInfo}</Text>}

      {barcode &&
        (barcodes[barcode] ? (
          <>
            <Text>
              FOUND {barcode} - {barcodes[barcode]}
            </Text>
            <Button title="Consume" />
            <Button title="Purchase" />
            <Button
              title="Relocate"
              onPress={() => setIsRelocating(!isRelocating)}
            />
            <View>
              {isRelocating && (
                <Text>SCAN TARGET LOCATION CODE: {relocateCode}</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <Text>NOT FOUND {barcode} </Text>
            <TextInput
              editable
              maxLength={40}
              onChangeText={(text) => setNewBarcodeInfo(text)}
              value={newBarcodeInfo}
              style={{ width: 100, height: 40, backgroundColor: "white" }}
            />
          </>
        ))}
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
