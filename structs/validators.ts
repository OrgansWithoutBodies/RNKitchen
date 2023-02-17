import * as ss from "superstruct";
import { RecipeBuddyRecipe } from "./types";
import isUrl from "is-url";

const URLStruct = ss.define<string>("URL", (value: any) => {
  return isUrl(value) && value.length < 2048;
});

// const EmailStruct = define('Email', (value) => {
//   if (!isEmail(value)) {
//     return { code: 'not_email' }
//   } else if (value.length >= 256) {
//     return { code: 'too_long' }
//   } else {
//     return true
//   }
// })

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
