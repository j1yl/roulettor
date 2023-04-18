import React from "react";

const BetDisplay = () => {

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <tbody>
          {/* {gameState.bets
            .filter((bet) => {
              return bet.betColor === props.color;
            })
            .map((bet) => (
              <tr key={bet.id}>
                <th>{bet.betAmount}</th>
                <td>{bet.userId}</td>
              </tr>
            ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default BetDisplay;
