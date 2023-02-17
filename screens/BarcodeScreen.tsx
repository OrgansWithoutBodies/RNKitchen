import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, ToastAndroid } from "react-native";
import axios from "axios";
import { Button, Text, View } from "../components/Themed";
import { Axios as AxiosAsync } from "axios-observable";
import React from "react";
import { SocketStarter, useWebSocket } from "../hooks/useWebSocket";
import { dataQuery } from "../state/data.query";

// async function getRecipes(setAccessToken, accessToken): Promise<Recipe[] | null> {
//   const recipeBuddyURL = 'http://192.168.88.242:4000'
//   if (!accessToken) {

// const { data } = await axios.post(recipeBuddyURL + "/api/auth/login", {
//   username: 'v',
//   password: 'testpass',
// });

//     setAccessToken(data.access_token)
//   }
//   const authHeader = {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   }
//   return (await axios.get(recipeBuddyURL + "/api/recipes", authHeader)).data || null

// }
export default function BarcodeScreen() {
  const barcodes = { "12345": "test", "23456": "test123" };
  const [barcode, setBarcode] = useState<string | null>("1245");

  const barcodeWebsocketObservable = dataQuery["barcodeWebSocket"];
  const scannedLocationCodeObservable = dataQuery["scannedLocationCode"];

  useEffect(() => {
    let nn = 0;
    barcodeWebsocketObservable.next(SocketStarter);
    scannedLocationCodeObservable.subscribe({
      next(observedValue) {
        if (nn === 0) {
          ToastAndroid.show("Barcode Server Connected", ToastAndroid.CENTER);
          nn = nn + 1;
        }

        setBarcode(observedValue);
      },
      error(errorVal) {
        ToastAndroid.show("Barcode Server Not Available!", ToastAndroid.CENTER);
      },
    });
    return () => barcodeWebsocketObservable.complete();
  }, []);
  const [isRelocating, setIsRelocating] = useState<boolean>(false);
  const [relocateCode, setRelocateCode] = useState<string | null>(null);
  const [newBarcodeInfo, setNewBarcodeInfo] = useState<string | null>(null);

  // function parseBarcode(wsData) {
  // console.log("TEST123", JSON.parse(wsData)["data"]["instance"]["code"]);
  //   const parsedCode = JSON.parse(wsData["data"])["instance"]["code"];
  // TODO validate this

  //   setBarcode(parsedCode);
  // }
  // TODO teardown websockets
  // TODO pipe this to observable
  // const ws = useWebSocket(
  //   parseBarcode,
  //   (closemsg) => console.log("TEST123-close", closemsg),
  //   (error) => console.log("TEST123-error", error)
  // );
  useEffect(() => {
    // https://medium.com/geekculture/a-beginners-guide-to-websockets-in-django-e45e68c68a71
    // https://blog.logrocket.com/how-to-implement-websockets-in-react-native/
    // const subscription = AxiosAsync.get(
    //   "http://192.168.88.242:8000/barcode/"
    // ).subscribe(
    //   (response) => {
    //     setBarcode(response.data[0].code);
    //   },
    //   (error) => console.log("ERROR", error)
    // );
    // return subscription.unsubscribe;
  }, []);
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
