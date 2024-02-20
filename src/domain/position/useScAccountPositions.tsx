import React, { useEffect, useState } from "react";
import { PositionInfo } from "./types";
import useScAccountSpotPosition from "./useScAccountSpotPosition";
import useScAccountPerpsPosition from "./useScAccountPerpsPosition";

export default function useScAccountPositions() {
  const { spotPosition } = useScAccountSpotPosition();
  const { perpsPosition } = useScAccountPerpsPosition();
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>();

  const checkExits = (type: string) => {
    console.log(positions.some((element) => element.type === type));
    return positions.some((element) => element.type === type);
  };

  useEffect(() => {
    let copy = [...positions];

    if (spotPosition && !checkExits("Spot")) {
      copy.push(spotPosition);
    }
    if (perpsPosition && !checkExits("Perps")) {
      copy.push(perpsPosition);
    }

    const totalBalance = copy.reduce((acc, prev) => {
      return acc + Number(Number(prev.totalValue));
    }, 0);

    setTotalBalance(totalBalance);

    copy.sort((a, b) => {
      if (a.type === "Spot") {
        return -1; // Put a after b
      } else if (b.type === "Spot") {
        return 1; // Put b after a
      } else {
        return 0; // Keep the order
      }
    });

    setPositions(copy);
  }, [spotPosition, perpsPosition]);

  return { positions, totalBalance };
}
