import { useState } from "react";
import { StyleSheet, TextInput, ToastAndroid } from "react-native";
import { Camera, CameraType } from "expo-camera";
import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View, Button } from "../../components/Themed";
import { RootTabScreenProps } from "../../types";
import React from "react";

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [grocyURL, setGrocyURL] = useState<string | null>(null);
  const [grocyAPI, setGrocyAPI] = useState<string | null>(null);
  const [barcodeServerUrl, setBarcodeServerUrl] = useState<string | null>(null);

  const [camera, setCamera] = useState<Camera | null>();
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [hasGivenPermission, setHasGivenPermission] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={{ width: "90%", height: "15%", flexDirection: "row" }}>
        <Text style={{ flex: 1, fontSize: 18, justifyContent: "flex-end" }}>
          Grocy URL
        </Text>
        <TextInput
          editable
          placeholder="http(s)://..."
          onChangeText={setGrocyURL}
          value={grocyURL || ""}
          style={{ flex: 2, height: "60%", backgroundColor: "white" }}
        />
      </View>

      <View style={{ width: "90%", height: "15%", flexDirection: "row" }}>
        <Text style={{ flex: 1, fontSize: 20, justifyContent: "flex-end" }}>
          Grocy API
        </Text>
        <TextInput
          editable
          placeholder="API"
          onChangeText={setGrocyAPI}
          value={grocyAPI || ""}
          style={{ flex: 2, height: "60%", backgroundColor: "white" }}
        />
      </View>
      {/* TODO IO API Key? */}
      <View style={{ width: "90%", height: "15%", flexDirection: "row" }}>
        <Text style={{ flex: 1, fontSize: 18, justifyContent: "flex-end" }}>
          IO Server URL
        </Text>
        <TextInput
          editable
          placeholder="http(s)://..."
          onChangeText={setBarcodeServerUrl}
          value={barcodeServerUrl || ""}
          style={{ flex: 2, height: "60%", backgroundColor: "white" }}
        />
      </View>

      {/* https://www.toptal.com/react-native/react-native-camera-tutorial */}
      <Button
        title="Scan QR"
        onPress={async () => {
          if (!hasGivenPermission) {
            await Camera.requestCameraPermissionsAsync().then((value) => {
              setHasGivenPermission(value.granted);
              setCameraOpen(value.granted);
            });
          } else {
            setCameraOpen(!cameraOpen);
          }
        }}
      />
      <View style={styles.cameraContainer}>
        {cameraOpen && (
          <Camera
            ref={(ref) => {
              return setCamera(ref);
            }}
            // pausePreview
            onBarCodeScanned={(result) => {
              const [scannedUrl, scannedAPI] = result.data.split("|");
              if (scannedAPI) {
                setGrocyAPI(scannedAPI);
                setGrocyURL(scannedUrl);
                setCameraOpen(false);
              } else {
                ToastAndroid.show(
                  "Not a valid grocy code!",
                  ToastAndroid.CENTER
                );
              }
            }}
            ratio={"1:1"}
            style={styles.camera}
            type={CameraType.back}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    width: "80%",
  },
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
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
