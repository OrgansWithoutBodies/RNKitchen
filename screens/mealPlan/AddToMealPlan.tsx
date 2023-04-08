import React, { useRef } from "react";
import { Button } from "react-native";
import { ModalSelectList } from "react-native-modal-select-list";
import { RecipeID } from "../../structs/types";
export type ModalOption = {
  label: string;
  value: string;
};
export function AddToMealPlan({
  options,
  setSelected,
  modalRef,
}: {
  modalRef: React.MutableRefObject<undefined>;
  options: ModalOption[];
  setSelected: (recipeId: RecipeID) => void;
}): JSX.Element {
  console.log(
    "Test123-meal",
    modalRef.current ? modalRef.current.state.visible : "none"
  );
  // TODO add "please add some recipes first"
  return (
    <>
      <ModalSelectList
        ref={modalRef}
        options={options}
        closeButtonText={"X"}
        // options={staticModalOptions}
        onSelectedOption={setSelected}
        disableTextSearch={false}
        // provider={modalOptionsProvider}
        numberOfLines={3}
      />
    </>
  );
}
