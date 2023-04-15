import React from "react";
import { Pressable } from "react-native";
import { View, Text } from "../../components/Themed";
import { useData } from "../../state/useAkita";

export default function TasksComponent() {
  const [{ products, recipes }] = useData(["products", "recipes"]);
  return (
    <View>
      {products.map(({ id }, ii) => (
        <View>
          {id !== undefined ? (
            <>
              <Text>{id}</Text>
              <Pressable>
                <Text>
                  {recipes
                    .filter(({ ingredients }) => {
                      return ingredients.includes(id);
                    })
                    .map(({ name }) => name)}
                </Text>
              </Pressable>
            </>
          ) : (
            <></>
          )}
        </View>
      ))}
    </View>
  );
}
