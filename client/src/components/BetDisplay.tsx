import React from "react";
import { useGameState } from "~/context/GameStateContext";

type Props = {
  color: "red" | "black" | "green";
};

const BetDisplay = (props: Props) => {
  const { gameState } = useGameState();

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <tbody>
          {gameState.bets
            .filter((bet) => {
              return bet.betColor === props.color;
            })
            .map((bet) => (
              <tr key={bet.id}>
                <th>{bet.betAmount}</th>
                <td>{bet.userId}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BetDisplay;
