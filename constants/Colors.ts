const tintColorLight = "#39e";
const tintColorDark = "#fff";

const mintChocolateDarkBrown = "#da7" as const;
const mintChocolateLightBrown = "#854" as const;
const mintChocolateDarkGreen = "#bfd" as const;
const mintChocolateLightGreen = "#dfe" as const;
type HexChar =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f";
// `#${HexChar}${HexChar}${HexChar}${HexChar}${HexChar}${HexChar}`
type HexCode = `#${HexChar}${HexChar}${HexChar}`;
type Theme = {
  text: HexCode;

  button1?: HexCode;
  button2?: HexCode;
  button3?: HexCode;
  button4?: HexCode;
  button5?: HexCode;

  background?: HexCode;
  tint?: HexCode;
  tabIconDefault?: HexCode;
  tabIconSelected?: HexCode;
};
export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
  mint: {
    text: mintChocolateDarkGreen,
    background: mintChocolateLightBrown,
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
} as Record<string, Theme>;
