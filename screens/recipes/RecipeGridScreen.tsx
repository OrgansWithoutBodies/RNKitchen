import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Image,
  TouchableHighlight,
  ImageBackground,
} from "react-native";

import { Text, View } from "../../components/Themed";
import { RootTabScreenProps } from "../../types";
import { dataQuery } from "../../state/data.query";
import { RecipeBuddyRecipe } from "../../structs/types";

export default function TabOneScreen({}: RootTabScreenProps<"TabOne">) {
  const recipesObservable = dataQuery["recipes"];

  const [recipes, setRecipes] = useState<RecipeBuddyRecipe[] | null>(null);
  const [touchedPicture, setTouchedPicture] = useState<number | null>(null);

  useEffect(() => {
    recipesObservable.subscribe({
      next(observedValue) {
        setRecipes(observedValue);
      },
    });
  }, []);

  return (
    <View
      style={{
        marginHorizontal: "auto",
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      {recipes && (
        <FlatList
          data={recipes}
          numColumns={3}
          renderItem={({ item, index }) => {
            console.log("rendering", item.imageUrl);
            return (
              <>
                <TouchableHighlight
                  style={{
                    aspectRatio: 1,
                    width: "30%",
                  }}
                  onPress={() => setTouchedPicture(index)}
                >
                  <ImageBackground
                    key={index}
                    style={{
                      width: "99%",
                      aspectRatio: 1,
                      borderWidth: 4,
                      borderRadius: 10,
                      borderColor: "#d35647",
                      // margin: 8,
                    }}
                    source={{ uri: item.imageUrl }}
                  >
                    {touchedPicture === index ? (
                      <>
                        <View style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                          <Text
                            style={{
                              justifyContent: "center",
                              fontStyle: "italic",
                              fontSize: 10,
                              textShadowRadius: 6,
                              textShadowColor: "rgba(255,0,0,1)",
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                        <FontAwesome
                          name="plus"
                          size={25}
                          color="white"
                          style={{ marginRight: 15 }}
                        />
                      </>
                    ) : (
                      <View></View>
                    )}
                  </ImageBackground>
                </TouchableHighlight>
              </>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
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
