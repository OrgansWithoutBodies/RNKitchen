import { Group, Line } from "@shopify/react-native-skia";
import React from "react";
import { ObjVec2 } from "../../structs/types";

export function Grid({
  nLines,
  gridSize,
  height,
  width,
  offsetPerc = 0,
}: {
  nLines: ObjVec2;
  gridSize: number;
  height: number;
  width: number;
  offsetPerc?: number;
}): JSX.Element {
  const lineColor = "white";
  const lineWidth = 3;
  return (
    <Group>
      {new Array(nLines.x).fill(0).map((_, ii) => {
        const xPos = (ii + offsetPerc) * gridSize;
        return (
          <Line
            key={`xLine-${ii}`}
            p1={{ x: xPos, y: 0 }}
            p2={{ x: xPos, y: height }}
            color={lineColor}
            strokeWidth={lineWidth}
          />
        );
      })}
      {new Array(nLines.y).fill(0).map((_, jj) => {
        const yPos = (jj + offsetPerc) * gridSize;

        return (
          <Line
            key={`yLine-${jj}`}
            p1={{ x: 0, y: yPos }}
            p2={{ x: width, y: yPos }}
            color={lineColor}
            strokeWidth={lineWidth}
          />
        );
      })}
    </Group>
  );
}
