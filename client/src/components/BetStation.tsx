import React, { useEffect, useState } from "react";
import RoulettePanel from "./RoulettePanel";

type Props = {
  balance: number;
  game: "roulette" | "default";
};

const BetStation = (props: Props) => {
  const [betAmount, setBetAmount] = useState(0);
  const [valid, setValid] = useState(false);
  const { balance } = props;

  useEffect(() => {
    if (Number.isNaN(betAmount) || betAmount < 0 || betAmount > balance) {
      setValid(false);
    } else {
      setValid(true);
    }
  });

  return (
    <>
      <div className="flex flex-col gap-4 p-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Bet Amount</span>
            {Number.isNaN(betAmount) && (
              <span className="label-text-alt text-error">
                Please enter an integer
              </span>
            )}
            {betAmount < 0 && (
              <span className="label-text-alt text-error">
                Please enter a positive number
              </span>
            )}
            {betAmount > balance && (
              <span className="label-text-alt text-error">
                You don&apos;t have enough money
              </span>
            )}
          </label>
          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <input
              name="bet"
              type="text"
              onChange={(e) => {
                setBetAmount(parseInt(e.target.value));
              }}
              value={betAmount}
              className="input-bordered input input-sm w-full"
            />
            <div className="btn-group justify-start md:justify-between">
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(Number.isInteger(betAmount) ? betAmount + 1 : 1);
                }}
              >
                +1
              </button>
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(
                    Number.isInteger(betAmount) ? betAmount + 10 : 10
                  );
                }}
              >
                +10
              </button>
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(
                    Number.isInteger(betAmount) ? betAmount + 100 : 100
                  );
                }}
              >
                +100
              </button>
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(Number.isInteger(betAmount) ? betAmount * 2 : 2);
                }}
              >
                x2
              </button>
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(~~(betAmount / 2));
                  setBetAmount(
                    Number.isInteger(betAmount) ? ~~(betAmount / 2) : NaN
                  );
                }}
              >
                1/2
              </button>
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(balance);
                }}
              >
                Max
              </button>
              <button
                className="btn-outline btn-sm btn"
                onClick={() => {
                  setBetAmount(0);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {props.game === "roulette" && (
          <RoulettePanel betAmount={betAmount} valid={valid} />
        )}
      </div>
    </>
  );
};

export default BetStation;
