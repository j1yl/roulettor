"use client";

import React, { useState, useEffect } from "react";

type Props = {
  nextGameTime: number;
  gameInterval: number;
  setAllowBets: React.Dispatch<React.SetStateAction<boolean>>;
};

const Timer = (props: Props) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    return Math.max(props.nextGameTime - now, 0);
  });

  const totalDuration = props.gameInterval; // assuming you pass these as props or have them available in this component
  const elapsedTime = totalDuration - timeLeft;
  const percentComplete = 100 - (elapsedTime / totalDuration) * 100;

  useEffect(() => {
    const now = Date.now();
    setTimeLeft(Math.max(props.nextGameTime - now, 0));
  }, [props.nextGameTime]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimeLeft - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [props.nextGameTime]);

  useEffect(() => {
    if (timeLeft <= 5000) {
      props.setAllowBets(false);
    } else {
      props.setAllowBets(true);
    }
  }, [timeLeft, props]);

  return (
    <div className="w-full">
      <div className="h-1">
        <div
          className="h-full rounded-full bg-white"
          style={{
            width: `${percentComplete}%`,
            transition: "width 1s linear",
          }}
        />
      </div>
      <div className="text-right">
        {Math.floor(timeLeft / 1000)}s left till spin
      </div>
    </div>
  );
};

export default Timer;
