import { useEffect, useRef } from "react";
import { useGameState } from "~/context/GameStateContext";

// w-20 = 80px

const slot =
  "w-[75px] h-[75px] m-[3px] rounded-lg aspect-square flex justify-center items-center";

const Spinner = () => {
  const myWheel = useRef<HTMLDivElement>(null);
  const gameState = useGameState();

  useEffect(() => {
    if (
      gameState.gameState.gameState === "ENDED" &&
      gameState.gameState.winningValue
    ) {
      spinWheel(gameState.gameState.winningValue);
    }
  }, [gameState]);

  let choiceArray = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];

  const spinWheel = (result: number) => {
    let position = choiceArray.indexOf(result);
    let rows = 12;
    let card = 75 + 8 * 2; // cardwidth * gap (on both sides so * 2)
    let landingPosition = rows * 15 * card + position * card + 340;

    // randomize the selection a little bit, function below
    // let randomize = Math.floor(Math.random() * 75) - 75 / 2;
    // landingPosition += randomize;

    let object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };

    if (myWheel.current) {
      myWheel.current.style.transitionTimingFunction =
        "cubic-bezier(0," + object.x + "," + object.y + ",1)";
      myWheel.current.style.transitionDuration = "5s";
      myWheel.current.style.transform =
        "translate3d(-" + landingPosition + "px, 0px, 0px)";
    }

    setTimeout(() => {
      if (myWheel.current) {
        myWheel.current.style.transitionTimingFunction = "";
        myWheel.current.style.transitionDuration = "";
        let resetTo = -(position * card + 700); // + randomize
        myWheel.current.style.transform =
          "translate3d(" + resetTo + "px, 0px, 0px)";
      }
    }, 5 * 1000);
  };

  return (
    <>
      <div className="relative mx-auto flex w-full justify-center overflow-hidden rounded-lg">
        <div ref={myWheel} className="flex gap-2">
          {Array.from({ length: 29 }, (_, i) => i).map((_, i) =>
            choiceArray.map((item, index) => {
              if (item === 0)
                return (
                  <div className={slot + " bg-green-600"} key={index}>
                    <p>{item}</p>
                  </div>
                );
              if (item % 2 === 1)
                return (
                  <div className={slot + " bg-red-700"} key={index}>
                    <p>{item}</p>
                  </div>
                );
              if (item % 2 === 0)
                return (
                  <div className={slot + " bg-zinc-900"} key={index}>
                    <p>{item}</p>
                  </div>
                );
            })
          )}
        </div>
        <div className="z-2 absolute left-1/2 top-0 h-full w-[3px] rounded-lg bg-zinc-50"></div>
      </div>
    </>
  );
};

export default Spinner;
