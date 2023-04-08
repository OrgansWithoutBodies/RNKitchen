import * as ss from "superstruct";
import { RecipeBuddyRecipe } from "../types";
import isUrl from "is-url";

const URLStruct = ss.define<string>("URL", (value: any) => {
  return isUrl(value) && value.length < 2048;
});
// TODO add validators for minimum set of fields expected for grocy
// const HasIDValidator
const SingleRecipeBuddyRecipeValidator: ss.Describe<
  RecipeBuddyRecipe & { __v: number }
> = ss.object({
  __v: ss.number(),
  _id: ss.string(),

  name: ss.string(),

  ingredients: ss.array(ss.string()),
  steps: ss.array(ss.string()),

  url: URLStruct,
  imageUrl: URLStruct,
});

export const ArrayRecipeBuddyRecipeValidator = ss.array(
  SingleRecipeBuddyRecipeValidator
);
